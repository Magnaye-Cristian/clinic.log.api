import { Router } from "express";
import { People } from "../models/people.models";
import { PeopleSQL } from "../sql_commands/people.sql";
import { ValidationSchemas } from "../validation_schemas/validation_schemas";

const accountsRouter = Router();

accountsRouter.post('/deactivate', async (req: any, res) => {
    const user: People = req.people;
    const accountToDeactivate = req.body;
    const { error } = ValidationSchemas.deactivate.validate(accountToDeactivate)

    if (error)
        return res.status(500).send(error.message)
    //TODO: check if exists before deactivating
    console.log(user)
    const results = await PeopleSQL.deactivate(accountToDeactivate.school_id, user.university);
    console.log(results)
    res.send('success')
})

accountsRouter.get('/admins', (req, res) => {
    res.send('admins1')
})

accountsRouter.get('/students', (req, res) => {
    res.send()
})

accountsRouter.get('/faculties', (req, res) => {

})

accountsRouter.get('/staff', (req, res) => {

})



export default accountsRouter;