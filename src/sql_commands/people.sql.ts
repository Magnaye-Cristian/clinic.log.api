import connection from "../connection";
import { Authenticate } from "../models/authenticate.model";
import { People } from "../models/people.models";
import { PeopleUpdate } from "../models/people-update.model";

export abstract class PeopleSQL {
    static async create(people: People) {
        const result = (await connection).execute(`
                INSERT INTO Peoples
                (role, 
                university_id,
                password, 
                department_id, 
                program_id, 
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
        let {
            first_name,
            last_name,
            middle_name,
            department_id,
            program_id,
            password } = people;

        const [row] = await (await connection).execute(`
            SELECT
            university_id,
            first_name,
            last_name,
            middle_name,
            department_id,
            program_id,
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
        if (!department_id) department_id = peopleRow.department_id;
        if (!program_id) program_id = peopleRow.program_id;
        if (!password) password = password;

        const result = (await connection).execute(`
            UPDATE Peoples
            SET
            first_name = ?,
            last_name = ?,
            middle_name = ?,
            department_id = ?,
            program_id = ?,
            password = ?
            WHERE
            university_id = ?
            AND
            school_id = ?
        `, [people.first_name, people.last_name, people.middle_name, people.department_id, people.program_id, people.password, people.university_id, people.school_id])
        // console.log(peopleRow)
        // console.log(rowAny.length)
        // console.log(rowAny)
        // console.log(rowAny[0].department_id)
        return true;
    }

    static async get(school_id: string, university_id: number): Promise<People | null> {
        const [row] = await (await connection).execute('SELECT * from Peoples where school_id = ?  and university_id = ?',
            [school_id, university_id]);
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

    static async ValidateCode(code: string) {
        const [row] = await (await connection).execute('SELECT COUNT(id) AS count FROM Codes WHERE code = ?', [code])
        const isValidCode = (row as any)[0].count == 1;

        console.log(`is valid code ${isValidCode}`)

        return isValidCode;
    }

    static async ValidateSchoolIdIfUnique(schoolId: string, university: number) {
        const [row] = await (await connection).execute('SELECT COUNT(id) AS count FROM Peoples WHERE school_id = ? AND university_id = ?',
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
        const [row] = await (await connection).execute('SELECT * from Peoples where school_id = ?  and university_id = ? and password = ?',
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
            university: row.university_id,
            password: row.password,
            department: row.department_id,
            program: row.program_id,
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