import { Router } from "express";
import { any } from "joi";
import { LogMedicineUpdate } from "../models/log-medicine-update.model";
import { Log } from "../models/log.model";
import { LogUpdate } from "../models/logUpdate.model";
import { People } from "../models/people.models";
import { LogSQL } from "../sql_commands/log.sql";
import { ValidationSchemas } from "../validation_schemas/validation_schemas";

const logsRouter = Router();
const success = { message: 'success' };
logsRouter.post('/', (req: any, res) => {
    let logsCreate: Log = req.body;
    const { error } = ValidationSchemas.logsCreate.validate(logsCreate);
    if (error)
        return res.status(500).send(error.message)
    //university is from admins account

    const admin: People = req.people;
    logsCreate = logsCreate as Log;
    console.log(logsCreate)
    if (!logsCreate.school_id)
        logsCreate.school_id = null
    logsCreate.university_id = admin.university_id;
    const logs = LogSQL.create(logsCreate);


    res.send(logs);
})

logsRouter.get('/', async (req: any, res) => {
    const admin: People = req.people;
    const logs: Log[] = await LogSQL.getAllByUniversity(admin.university_id);

    res.send(logs)
})


logsRouter.get('/withtimeout', async (req: any, res) => {
    const admin: People = req.people;
    const day = req.query.day;
    const month = req.query.month;
    const year = req.query.year;
    console.log(day)
    console.log(month)
    console.log(year)

    const results = await LogSQL.getAllByUniversityAndTimeoutIsNotNull(day, month, year, admin.university_id)
    res.send(results)
})

logsRouter.get('/notimeout', async (req: any, res) => {
    const admin: People = req.people;
    const logs: Log[] = await LogSQL.getAllByUniversityAndNullTimeout(admin.university_id);
    res.send(logs)
})
logsRouter.post('/timeoutLog', async (req: any, res) => {
    const { error } = ValidationSchemas.logId.validate(req.body)
    const admin: People = req.people;
    if (error)
        return res.status(500).send({ message: error.message })
    const id = req.body.id;
    // const date = Date.now();
    const nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Hong_Kong'
    });
    const logs = await LogSQL.timeout(admin.university_id, id)
    // pass id of timeout log
    res.send(success)
})
logsRouter.get('/tally', async (req: any, res) => {
    const admin: People = req.people;
    const { year, month } = req.query
    const results = await LogSQL.tally(admin.university_id, month, year);
    res.send(results)
})
logsRouter.put('/', async (req: any, res) => {
    const admin: People = req.people;
    const { error } = ValidationSchemas.logUpdate.validate(req.body);

    if (error)
        return res.status(400).send({ message: error.message })
    const log: LogUpdate = req.body;
    const results = await LogSQL.update(log, admin.university_id)
    res.send(success)
})

logsRouter.put('/medicine', async (req: any, res) => {
    const admin: People = req.people;
    const { error } = ValidationSchemas.logUpdateMedicine.validate(req.body);
    if (error)
        return res.status(400).send({ message: error.message })
    const log: LogMedicineUpdate = req.body;
    const results = await LogSQL.updateMedicine(log);
    res.send(success)
})

logsRouter.get('/medicine', async (req: any, res) => {
    //return log record that has medicine, and timeout equals that date that is passed to this request
    const admin: People = req.people;
    const day = req.query.day;
    const month = req.query.month;
    const year = req.query.year;
    console.log(day)
    console.log(month)
    console.log(year)

    const results = await LogSQL.getAllByUniversityAndMedicineIsNotNull(day, month, year, admin.university_id)
    res.send(results)
})


// logsRouter.delete('', async (req: any, res) => {
//     const id = req.query.id;
//     console.log(`delete`)
//     console.log(id)
//     const results = await LogSQL.delete(id);
//     res.send(success)
// })

export default logsRouter;