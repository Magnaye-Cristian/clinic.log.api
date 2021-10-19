import connection from "../connection";
import { Authenticate } from "../models/authenticate.model";
import { People } from "../models/people.models";
import { PeopleUpdate } from "../models/people-update.model";
import { Account } from "../models/account.model";

export abstract class PeopleSQL {
    static async create(people: People) {
        const result = (await connection).execute(`
                INSERT INTO Peoples
                (role, 
                university,
                password, 
                department, 
                program, 
                school_id, 
                first_name, 
                last_name, 
                middle_name, 
                created_on, 
                status)
                VALUES
                (?,?,?,?,?,?,?,?,?, NOW(), "active")`,
            [
                people.role,
                people.university,
                people.password,
                people.department,
                people.program,
                people.school_id,
                people.first_name,
                people.last_name,
                people.middle_name
            ]);
        console.log(result);
        return true;
    }

    static async deactivate(school_id: string, university: string) {
        console.log('uni: ' + university)
        console.log(school_id)
        const sql = (await connection).format(`
        UPDATE Peoples
        SET
        status = "deactivated"
        WHERE
        school_id = ? 
        AND
        university = ?
        `, [school_id, university]);
        console.log(sql);
        const [rows] = await (await connection).query(sql);
        // const result = (await connection).execute()
        // return result;
        return rows
    }

    static async update(people: PeopleUpdate) {
        /**
         * get database row first
         * only udpate fields that are modified
         *  WHERE school_id = ? AND university_id = ?
         */
        let {
            first_name,
            last_name,
            middle_name,
            department_id,
            program_id,
            password } = people;

        const [row] = await (await connection).execute(`
            SELECT
            university,
            first_name,
            last_name,
            middle_name,
            department,
            program,
            password
            FROM
            Peoples
            WHERE
            university_id = ?
            AND
            school_id = ?`, [
            people.university,
            people.school_id
        ])
        const rowAny = row as PeopleUpdate[];

        if (rowAny.length !== 1) {
            console.log(`something is wrong with the data, the return length is ${rowAny.length}`)
            return false
        }

        const peopleRow = rowAny[0];
        if (!first_name) first_name = peopleRow.first_name;
        if (!last_name) last_name = peopleRow.last_name;
        if (!middle_name) middle_name = peopleRow.middle_name;
        if (!department_id) department_id = peopleRow.department_id;
        if (!program_id) program_id = peopleRow.program_id;
        if (!password) password = password;

        const result = (await connection).execute(`
            UPDATE Peoples
            SET
            first_name = ?,
            last_name = ?,
            middle_name = ?,
            department = ?,
            program = ?,
            password = ?
            WHERE
            university = ?
            AND
            school_id = ?
        `, [people.first_name, people.last_name, people.middle_name, people.department_id, people.program_id, people.password, people.university, people.school_id])
        // console.log(peopleRow)
        // console.log(rowAny.length)
        // console.log(rowAny)
        // console.log(rowAny[0].department_id)
        return true;
    }

    static async getAccounts(role: string, university: string): Promise<Account[]> {
        const [row] = await (await connection).execute(`
            SELECT * FROM Peoples
            WHERE
            role = ?
            AND
            university = ?`, [role, university])
        const rowAny = row as any[];
        if (rowAny.length < 1)
            return [];
        return this.sqlPeopleToAccounts(rowAny);
    }

    static sqlPeopleToAccounts(row: any[]): Account[] {
        let accounts: Account[] = [];
        row.forEach((people: any) => {
            const newAccount: Account = {
                school_id: people.school_id,
                first_name: people.first_name,
                last_name: people.last_name,
                middle_name: people.middle_name,
                status: people.status
            }
            accounts.push(newAccount)
        });
        return accounts;
    }

    static async get(school_id: string, university: string): Promise<People | null> {
        const [row] = await (await connection).execute('SELECT * from Peoples where school_id = ?  and university = ?',
            [school_id, university]);
        const rowAny = row as any;
        const rowResult = [0];
        console.log(`length ${rowAny.length}`)
        if (!rowResult || rowAny.length > 1) {
            console.log('row result falsy')
            return null
        }
        console.log(rowResult)
        return this.sqlPeopleToPeopleModel(rowResult);
    }

    static async ValidateCode(code: string) {
        const [row] = await (await connection).execute('SELECT COUNT(id) AS count FROM Codes WHERE code = ?', [code])
        const isValidCode = (row as any)[0].count == 1;
        console.log((row as any)[0].count)
        console.log(`is valid code ${isValidCode}`)

        return isValidCode;
    }
    private static async codeGenerator(): Promise<string> {
        /**
         * generate random code, check in database if it exists, if it does the call codeGenerator again
         */
        // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
        //Can change 7 to 2 for longer results.
        const code = (Math.random() + 1).toString(36).substring(7);
        const [row] = await (await connection).execute('SELECT COUNT(id) AS count FROM Codes WHERE code = ?', [code])
        const isValidCode = (row as any)[0].count === 0;
        return isValidCode ? code : await this.codeGenerator();
    }
    static async GenerateCode(role: string) {
        const allowedRoles = ['student', 'faculty', 'staff', 'admin', 'head admin'];
        const code = await this.codeGenerator();
        if (!allowedRoles.includes(role.toLowerCase())) return;

        const result = (await connection).execute(`
                INSERT INTO Codes
                (role, code)
                VALUES
                (?,?)`,
            [
                role,
                code
            ]);
        console.log(result);
        return code;
    }

    static async ValidateSchoolIdIfUnique(schoolId: string, university: string) {
        const [row] = await (await connection).execute('SELECT COUNT(id) AS count FROM Peoples WHERE school_id = ? AND university = ?',
            [schoolId, university]);
        const isValidSchoolId = (row as any)[0].count < 1;
        console.log(`is valid schoolid ${isValidSchoolId}`)
        return isValidSchoolId;
    }
    /**
     * @param authenticate 
     * @returns null if invalid, else return people
     */
    static async login(authenticate: Authenticate) {
        // duplicate logic of get, can be refactored
        const [row] = await (await connection).execute('SELECT * from Peoples where school_id = ?  and university = ? and password = ?',
            [authenticate.schoolId, authenticate.university, authenticate.password]);
        const rowAny = row as any;
        const rowResult = rowAny[0];
        console.log(`length ${rowAny.length}`)
        if (!rowResult || rowAny.length > 1) {
            console.log('row result falsy')
            return null
        }
        console.log(rowResult);

        return this.sqlPeopleToPeopleModel(rowResult);
    }

    static sqlPeopleToPeopleModel(row: any): People {

        const people: People = {
            role: row.role,
            university: row.university,
            password: row.password,
            department: row.department,
            program: row.program,
            school_id: row.school_id,
            first_name: row.first_name,
            last_name: row.last_name,
            middle_name: row.middle_name,
            status: row.status,
            code: ''
        }

        return people;
    }
}