import connection from "../connection";
import { LogMedicineUpdate } from "../models/log-medicine-update.model";
import { Log } from "../models/log.model";
import { LogUpdate } from "../models/logUpdate.model";

export abstract class LogSQL {
    static async delete(id: any) {
        let [row] = await (await connection).execute(`
        DELETE FROM Logs WHERE id = ?
        `, [
            id
        ]);
        console.log(row)
        return true;
    }
    static async updateMedicine(log: LogMedicineUpdate) {
        let [row] = await (await connection).execute(`
        UPDATE Logs
        SET
        medicine = ?
        WHERE id = ?
        `, [
            log.medicine,
            log.id
        ]);
        console.log(row)
        return true;
    }
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
        // missing schoolid, department
        const [results] = await (await connection).execute(`
        select l.id, l.type, Peoples.school_id, l.type_spec, l.people_id, l.purpose, l.complaint, l.first_name, l.last_name, l.middle_name, l.address, l.timein, l.timeout, l.university_id, l.department, l.medicine from Logs as l LEFT JOIN Peoples on l.people_id = Peoples.id
         WHERE l.university_id = ? and l.timeout is null
        `, [university_id])
        console.log(results)
        const _results = results as Log[];
        return _results;
    }
    static async getAllByUniversity(university_id: number): Promise<Log[]> {
        const [results] = await (await connection).execute(`
        select l.id, l.type, Peoples.school_id, l.type_spec, l.people_id, l.purpose, l.complaint, l.first_name, l.last_name, l.middle_name, l.address, l.timein, l.timeout, l.university_id, l.department, l.medicine from Logs as l LEFT JOIN Peoples on l.people_id = Peoples.id
 WHERE l.university_id = ? and l.timeout is not null
        `, [university_id])
        console.log(results)
        const _results = results as Log[];
        return _results;
    }
    static async create(log: Log) {
        console.log(log)

        const date = new Date();
        // TODO: less prio
        // this should be 2 different queries, on is for type university and non university
        // if type university get the information in other database
        console.log(log.department)
        const sql = await (await connection).format(`
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
                complaint,
                department
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
            [log.people_id,
            log.type,
            log.type_spec,
            log.first_name,
            log.last_name,
            log.middle_name,
            log.address,
                date,
            log.university_id,
            log.purpose,
            log.complaint,
            log.department
            ]);
        console.log(sql)
        const [results] = await (await connection).query(sql)
        console.log(results)
        return true;
    }
}