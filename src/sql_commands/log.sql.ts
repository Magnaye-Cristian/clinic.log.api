import connection from "../connection";
import { LogMedicineUpdate } from "../models/log-medicine-update.model";
import { Log } from "../models/log.model";
import { LogUpdate } from "../models/logUpdate.model";


export abstract class LogSQL {
    static async getAllByUniversityAndMedicineIsNotNull(day: any, month: any, year: any, university_id: number) {
        const [row] = await (await connection).query(`
        select l.id, l.type, Peoples.school_id, l.type_spec, l.people_id, l.purpose, l.complaint, l.first_name, l.last_name, l.middle_name, l.address, l.timein, l.timeout, l.university_id, l.department, l.medicine from Logs as l LEFT JOIN Peoples on l.people_id = Peoples.id
         where medicine is not null and day(timeout) = ? and month(timeout) = ? and year(timeout) = ? and l.university_id = ?`
            , [
                day, month, year, university_id
            ])
        console.log(row);
        return row
    }

    static async getAllByUniversityAndTimeoutIsNotNull(day: any, month: any, year: any, university_id: number) {
        console.log(`university_id ${university_id}`)
        const [row] = await (await connection).query(`
        select l.id, l.type, Peoples.school_id, l.type_spec, l.people_id, l.purpose, l.complaint, l.first_name, l.last_name, l.middle_name, l.address, l.timein, l.timeout, l.university_id, l.department, l.medicine from Logs as l LEFT JOIN Peoples on l.people_id = Peoples.id
         where timeout is not null and day(timeout) = ? and month(timeout) = ? and year(timeout) = ? and l.university_id = ?`
            , [
                day, month, year, university_id
            ])
        console.log(row);
        return row
    }

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
            type, type_spec, id, first_name, last_name, middle_name, purpose, complaint, address, medicine, people_id, department
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
        if (!medicine) medicine = logSelect.medicine;
        if (!people_id) people_id = logSelect.people_id;
        if (!department) department = logSelect.department;


        const result = await (await connection).query(`
        UPDATE Logs
        SET
        type = ?,
        department = ?,
        type_spec = ?,
        first_name = ?,
        last_name = ?,
        middle_name = ?,
        address = ?,
        purpose = ?,
        complaint = ?,
        people_id = ?,
        medicine = ?
        WHERE id = ?
        `, [
            type,
            department,
            type_spec,
            first_name,
            last_name,
            middle_name,
            address,
            purpose,
            complaint,
            people_id,
            medicine,
            id
        ]);
        return true;
    }
    static async tally(university_id: number, month: number, year: number) {
        console.log(month, year)
        const [results] = await (await connection).query(`
        SELECT timein, complaint, count(complaint) AS count from Logs where timeout is not null and MONTH(timein) = ? AND YEAR(timein) = ? and university_id = ? group by day(timein) , complaint`,
            [
                month,
                year,
                university_id
            ]);
        return results
    }
    static async timeout(university_id: number, id: any) {
        console.log(`university_id ${university_id}`)
        console.log(`id ${id}`)
        // const date = new Date()
        const nDate = new Date(new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Hong_Kong'
        }));
        console.log(nDate)
        const [results] = await (await connection).execute(`
        UPDATE Logs
        SET timeout = ?
        WHERE university_id = ? 
        AND id = ?
        `, [nDate, university_id, id])
        console.log(results)
        return true;
    }
    static async getAllByUniversityAndNullTimeout(university_id: number): Promise<Log[]> {
        // missing schoolid, department
        const [results] = await (await connection).execute(`
        select l.id, l.type, Peoples.school_id, l.type_spec, l.people_id, l.purpose, l.complaint, l.first_name, l.last_name, l.middle_name, l.address, l.timein, l.timeout, l.university_id, l.department, l.medicine from Logs as l LEFT JOIN Peoples on l.people_id = Peoples.id
         WHERE l.university_id = ? and l.timeout is null order by timein desc
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

        const nDate = new Date(new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Hong_Kong'
        }));
        console.log(nDate)
        // TODO: less prio
        // this should be 2 different queries, on is for type university and non university
        // if type university get the information in other database
        console.log(log.department)
        const [results] = await (await connection).query(`
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
                nDate,
            log.university_id,
            log.purpose,
            log.complaint,
            log.department
            ])
        console.log(results)
        return true;
    }
}