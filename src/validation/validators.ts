import connection from "../connection";
import { Login } from "../models/login.model";


export abstract class Validators {
    // https://stackoverflow.com/questions/59176566/node-js-async-await-mysql-get-result-of-inserted-row
    static ValidateCode(code: string) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(id) as count from Codes where code = ?',
                [code], (err, res: any, fields) => {
                    const { count } = res[0];
                    console.log(count)
                    resolve(count > 0)
                })
        })
    }

    static ValidateSchoolIdIfUnique(schoolId: string, university: number) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(id) as count from Peoples where school_id = ?  and university_id = ?',
                [schoolId, university], (err, res: any, fields) => {
                    const { count } = res[0];
                    const isValidSchoolId = count < 1;
                    console.log(`is valid schoolid ${isValidSchoolId}`)
                    resolve(isValidSchoolId)
                })
        })
    }

    static ValidateLogin(login: Login) {
        //TODO: encrypt password
        return new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(id) as count from Peoples where school_id = ?  and university_id = ? and password = ?',
                [login.schoolId, login.university, login.password], (err, res: any, fields) => {
                    const { count } = res[0];
                    const isValidLoginCredentials = count == 1;
                    console.log(`is valid schoolid ${isValidLoginCredentials}`)
                    resolve(isValidLoginCredentials)
                })
        })
    }
}

