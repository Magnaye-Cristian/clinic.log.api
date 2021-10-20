import connection from "../connection";
import { University } from "../models/university.model";

export abstract class UniversitySQL {
    static async getUniversity(name: string)
        : Promise<University | undefined> {
        let university: University | undefined = undefined;
        const [results] = await (await connection).execute(`SELECT Id, name FROM Universities WHERE name = ?`, [name]);
        const res = results as any[];
        // console.log(results)
        if (res.length == 1) {
            const _university = res[0];
            university = {
                id: _university.Id,
                name: _university.name
            }
            console.log(1)
            console.log(university)
        }
        return university;
    }
}