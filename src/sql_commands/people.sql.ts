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
                people.schoolId,
                people.first_name,
                people.last_name,
                people.middle_name
            ]);
        console.log(result);
        return true;
    }

    static async update(people: PeopleUpdate) {
        /**
         * get database row first
         * only udpate fields that are modified
         *  WHERE school_id = ? AND university_id = ?
         */
        const [row] = await (await connection).execute('SELECT * FROM Peoples')
        console.log(row)

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
     * 
     * @param authenticate 
     * @returns null if invalid, else return people
     */
    static async login(authenticate: Authenticate) {
        // TODO: encrypt password
        const [row] = await (await connection).execute('SELECT * from Peoples where school_id = ?  and university_id = ? and password = ?',
            [authenticate.schoolId, authenticate.university, authenticate.password]);
        const rowResult = (row as any)[0];
        console.log(`length ${rowResult.length}`)
        if (!rowResult || rowResult.length > 1) {
            console.log('row result falsy')
            return null
        }
        console.log(rowResult);

        return this.sqlPeopleToPeopleModel(rowResult);
        // const people: People = {

        // }
        // console.log(people)
        // const isValidLoginCredentials = (row as any)[0].count == 1;
        // console.log(`is valid login credentials ${isValidLoginCredentials}`)
        // return isValidLoginCredentials;
    }
    static sqlPeopleToPeopleModel(row: any): People {

        const people: People = {
            role: row.role,
            university: row.university_id,
            password: row.password,
            department: row.department_id,
            program: row.program_id,
            schoolId: row.schoold_id,
            first_name: row.first_name,
            last_name: row.last_name,
            middle_name: row.middle_name,
            status: row.status,
            code: ''
        }

        return people;
    }
}