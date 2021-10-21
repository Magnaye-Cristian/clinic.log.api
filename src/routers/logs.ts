import { Router } from "express";
import { Log } from "../models/log.model";
import { People } from "../models/people.models";
import { LogSQL } from "../sql_commands/log.sql";
import { ValidationSchemas } from "../validation_schemas/validation_schemas";

const logsRouter = Router();

logsRouter.post('/', (req: any, res) => {
    let logsCreate: Log = req.body;
    const { error } = ValidationSchemas.logsCreate.validate(logsCreate);
    if (error)
        return res.status(500).send(error.message)
    //university is from admins account

    const admin: People = req.people;
    logsCreate = logsCreate as Log;
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
logsRouter.get('/notimeout', (req, res) => {
    res.send('')
})
logsRouter.post('/timeoutLog', (req, res) => {
    res.send('')

})
// logsRouter.get('/:id', (req, res) => {
//     res.send('')
// })
logsRouter.put('/', (req, res) => {

})

export default logsRouter;