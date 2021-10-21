import connection from "../connection";
import { Log } from "../models/log.model";

export abstract class LogSQL {
    static async timeout(university_id: number, id: any) {
        console.log(`university_id ${university_id}`)
        console.log(`id ${id}`)
        const [results] = await (await connection).execute(`
        UPDATE Logs
        SET timeout = NOW()
        WHERE university_id = ? 
        AND id = ?
        `, [university_id, id])
        console.log(results)
        return true;
    }
    static async getAllByUniversityAndNullTimeout(university_id: number): Promise<Log[]> {
        const [results] = await (await connection).execute(`
        SELECT * FROM Logs WHERE university_id = ? and timeout is null
        `, [university_id])
        console.log(results)
        const _results = results as Log[];
        return _results;
    }
    static async getAllByUniversity(university_id: number): Promise<Log[]> {
        const [results] = await (await connection).execute(`
        SELECT * FROM Logs WHERE university_id = ?
        `, [university_id])
        console.log(results)
        const _results = results as Log[];
        return _results;
    }
    static async create(log: Log) {
        console.log(log)

        const date = new Date();
        const [results] = await (await connection).execute(`
            INSERT INTO Logs
            (
                people_id,
                type,
                type_spec,
                first_name,
                last_name,
                middle_name,
                address,
                timein,
                university_id,
                purpose,
                complaint
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
            [log.school_id,
            log.type,
            log.type_spec,
            log.first_name,
            log.last_name,
            log.middle_name,
            log.address,
                date,
            log.university_id,
            log.purpose,
            log.complaint
            ]);
        console.log(results)
        return true;
    }
}