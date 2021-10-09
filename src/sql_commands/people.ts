import connection from "../connection";
import { Login } from "../models/login.model";
import { People } from "../models/people.models";

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

    static async ValidateCode(code: string) {
        const [row] = await (await connection).execute('SELECT COUNT(id) as count from Codes where code = ?', [code])
        const isValidCode = (row as any)[0].count == 1;
        console.log(`is valid code ${isValidCode}`)

        return isValidCode;
    }

    static async ValidateSchoolIdIfUnique(schoolId: string, university: number) {
        const [row] = await (await connection).execute('SELECT COUNT(id) as count from Peoples where school_id = ?  and university_id = ?',
            [schoolId, university]);
        const isValidSchoolId = (row as any)[0].count < 1;
        console.log(`is valid schoolid ${isValidSchoolId}`)
        return isValidSchoolId;
    }

    static async ValidateLogin(login: Login) {
        // TODO: encrypt password
        const [row] = await (await connection).execute('SELECT COUNT(id) as count from Peoples where school_id = ?  and university_id = ? and password = ?',
            [login.schoolId, login.university, login.password]);
        const isValidLoginCredentials = (row as any)[0].count == 1;
        console.log(`is valid login credentials ${isValidLoginCredentials}`)
        return isValidLoginCredentials;
    }
}