import connection from "../connection";
import { Log } from "../models/log.model";

export abstract class LogSQL {
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