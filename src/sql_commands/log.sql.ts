import connection from "../connection";
import { Log } from "../models/log.model";
import { LogUpdate } from "../models/logUpdate.model";

export abstract class LogSQL {
    static async update(logUpdate: LogUpdate, university_id: number) {
        let {
            type, type_spec, id, first_name, last_name, middle_name, purpose, complaint, address
        } = logUpdate;
        console.log(`id ${id}, university: ${university_id}`)

        let [row] = await (await connection).execute(`SELECT * FROM Logs WHERE id = ? AND university_id = ?`, [id, university_id])
        let logResults: LogUpdate[] = row as LogUpdate[];
        console.log(logResults)
        const logSelect = logResults[0];
        if (!logResults || logResults.length !== 1) {
            console.log('not === 1 return')
            return
        }

        console.log(`logResults.length ${logResults.length}`)
        if (!type) type = logSelect.type;
        if (!type_spec) type_spec = logSelect.type_spec;
        if (!first_name) first_name = logSelect.first_name;
        if (!last_name) last_name = logSelect.last_name;
        if (!middle_name) middle_name = logSelect.middle_name;
        if (!purpose) purpose = logSelect.purpose;
        if (!complaint) complaint = logSelect.complaint;
        if (!address) address = logSelect.address;

        const sql = await (await connection).format(`
        UPDATE Logs
        SET
        type = ?,
        type_spec = ?,
        first_name = ?,
        last_name = ?,
        middle_name = ?,
        address = ?,
        purpose = ?,
        complaint = ?
        WHERE id = ?
        `, [
            type,
            type_spec,
            first_name,
            last_name,
            middle_name,
            address,
            purpose,
            complaint,
            id
        ])
        console.log(sql)
        const result = await (await connection).query(sql);
        return true;
    }
    static async tally(university_id: number, month: number, year: number) {
        const sql = (await connection).format(`
        SELECT timein, complaint, count(complaint) AS count from Logs where MONTH(timein) = ? AND YEAR(timein) = ? and university_id = ? group by day(timein) , complaint`,
            [
                month,
                year,
                university_id
            ])
        console.log(sql)
        const [results] = await (await connection).query(sql);
        return results
    }
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