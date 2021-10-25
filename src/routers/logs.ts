import { Router } from "express";
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

    const logs = await LogSQL.timeout(admin.university_id, id)
    // pass id of timeout log
    res.send(success)
})
logsRouter.get('/tally', async (req: any, res) => {
    const admin: People = req.people;
    const { error } = ValidationSchemas.logTally.validate(req.body);

    if (error)
        return res.status(400).send({ message: error.message })
    const date: { year: number, month: number } = req.body
    const results = await LogSQL.tally(admin.university_id, date.month, date.year);

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

logsRouter.delete('', async (req: any, res) => {
    const id = req.query.id;
    console.log(`delete`)
    console.log(id)
    const results = await LogSQL.delete(id);
    res.send(success)
})

export default logsRouter;