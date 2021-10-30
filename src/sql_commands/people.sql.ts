import connection from "../connection";
import { Authenticate } from "../models/authenticate.model";
import { People } from "../models/people.models";
import { PeopleUpdate } from "../models/people-update.model";
import { Account } from "../models/account.model";
interface IUpdateTokens { fieldCount?: number, affectedRows?: number, insertId?: number, info?: string, serverStatus?: number, warningStatus?: number, changedRows?: number }

export abstract class PeopleSQL {
    static async totalNumberOfPurpose(purpose: string, university_id: number, month: number, year: number) {
        const sql = await (await connection).format(`SELECT COUNT(id) as count FROM Logs where purpose = ? and university_id = ? and month(timeout) = ? and year(timeout) = ?`,
            [purpose, university_id, month, year])
        console.log(sql)
        const [row] = await (await connection).execute(`SELECT COUNT(id) as count FROM Logs where purpose = ? and university_id = ? and month(timeout) = ? and year(timeout) = ?`,
            [purpose, university_id, month, year])
        console.log(row)
        return (row as any)[0].count
    }


    static async totalNumberOfComplaintsInNYearGroupByMonths(complaints: string, university_id: number, year: number) {
        const [row] = await (await connection).execute(`SELECT monthname(timein) as name, COUNT(id) as value FROM Logs where complaint = ? and university_id = ? and YEAR(timein) = ? group by MONTH(timein)`,
            [complaints, university_id, year])
        console.log(row)
        return row
    }


    static async getAllCodes(university_id: number) {
        // todo need universityid
        const [results] = await (await connection).execute(`
        SELECT * FROM Codes where university_id = ?
        `, [university_id])
        return results as { code: string, role: string, createon: Date }[];
    }

    static async create(people: People) {


        const nDate = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Hong_Kong'
        });
        console.log(nDate)
        const [results] = await (await connection).execute(`
                INSERT INTO Peoples
                (role, 
                university_id,
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
                (?,?,?,?,?,?,?,?,?, ?, "active")`,
            [
                people.role,
                people.university_id,
                people.password,
                people.department,
                people.program,
                people.school_id,
                people.first_name,
                people.last_name,
                people.middle_name,
                nDate
            ]);
        // const _res = results as IUpdateTokens;

        // console.log(_res.insertId);

        // const [row] = await (await connection).execute(`
        //     SELECT * FROM Peoples WHERE Id = ?`, [_res.insertId]);

        // const rowAny = row as any;
        // const rowResult = rowAny[0];
        // console.log(`length ${rowAny.length}`)
        // if (!rowResult || rowAny.length > 1) {
        //     console.log('row result falsy')
        //     return null
        // }
        // console.log(rowResult);

        // return this.sqlPeopleToPeopleModel(rowResult);


        return true;
    }
    static async totalNumberOfRole(role: string, university_id: number) {
        const [row] = await (await connection).execute(`SELECT COUNT(id) as count FROM Peoples where role = ? and university_id = ? and status = 'active'`, [role, university_id])
        console.log(row)
        return (row as any)[0].count
    }
    static async deactivate(school_id: string, university_id: number) {
        console.log('uni: ' + university_id)
        console.log(school_id)
        const sql = (await connection).format(`
        UPDATE Peoples
        SET
        status = "deactivated"
        WHERE
        school_id = ? 
        AND
        university_id = ?
        `, [school_id, university_id]);
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
        console.log(people)
        let {
            first_name,
            last_name,
            middle_name,
            department: department,
            program: program,
            password } = people;

        const [row] = await (await connection).execute(`
            SELECT
            university_id,
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
            people.university_id,
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
        if (!department) department = peopleRow.department;
        if (!program) program = peopleRow.program;
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
            university_id = ?
            AND
            school_id = ?
        `, [people.first_name, people.last_name, people.middle_name, people.department, people.program, people.password, people.university_id, people.school_id])
        // consola.log(, peopleRow)
        // console.log(rowAny.length)
        // console.log(rowAny)
        // console.log(rowAny[0].department_id)
        console.log(people.first_name, people.last_name, people.middle_name, people.department, people.program, people.password, people.university_id, people.school_id)
        return true;
    }

    static async getAccounts(role: string, university: number): Promise<Account[]> {
        console.log(`---------get accounts`)
        const [row] = await (await connection).execute(`
            SELECT * FROM Peoples
            WHERE
            role = ?
            AND
            university_id = ?`, [role, university])
        const rowAny = row as any[];
        console.log(rowAny)
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
                status: people.status,
                department: people.department,
            }
            accounts.push(newAccount)
        });
        return accounts;
    }

    static async get(school_id: string, university_id: number): Promise<People | null> {
        const [row] = await (await connection).execute('SELECT * from Peoples where school_id = ?  and university_id = ?',
            [school_id, university_id]);
        const rowAny = row as any;
        console.log(`length ${rowAny.length}`)
        if (rowAny.length !== 1) {
            console.log('row result falsy')
            return null
        }
        console.log(rowAny)
        return this.sqlPeopleToPeopleModel(rowAny[0]);
    }

    static async ValidateCode(code: string, role: string) {
        console.log(`validate code: code ${code}, role: ${role}`)
        const [row] = await (await connection).execute('SELECT COUNT(id) AS count FROM Codes WHERE code = ? AND role = ?', [code, role])
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
    static async GenerateCode(role: string, university_id: number) {
        const allowedRoles = ['student', 'faculty', 'staff', 'admin', 'head admin'];
        const code = await this.codeGenerator();
        console.log(university_id)
        if (!allowedRoles.includes(role.toLowerCase())) return;

        const result = (await connection).execute(`
                INSERT INTO Codes
                (role, code, created_on, university_id)
                VALUES
                (?, ?, ?, ?)`,
            [
                role,
                code,
                new Date(),
                university_id
            ]);
        console.log(result);
        return code;
    }

    static async ValidateSchoolIdIfUnique(schoolId: string, university_id: number) {
        console.log(`validateSchoolIdIfUnique ${schoolId}, university_id: ${university_id}`)
        const [row] = await (await connection).execute('SELECT COUNT(id) AS count FROM Peoples WHERE school_id = ? AND university_id = ?',
            [schoolId, university_id]);
        const isValidSchoolId = (row as any)[0].count < 1;
        console.log(`is valid schoolid ${isValidSchoolId}`)
        return isValidSchoolId;
    }
    /**
     * @param authenticate 
     * @returns null if invalid, else return people
     */
    static async login(authenticate: Authenticate, university_id: number) {
        // duplicate logic of get, can be refactored
        console.log(`universityid: ${university_id}`)
        const [row] = await (await connection).execute('SELECT * from Peoples where school_id = ?  and university_id = ? and password = ?',
            [authenticate.schoolId, university_id, authenticate.password]);
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
            id: row.id,
            role: row.role,
            university_id: row.university_id,
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