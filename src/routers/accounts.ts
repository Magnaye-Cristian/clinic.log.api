import { Router } from "express";
import { Account } from "../models/account.model";
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

accountsRouter.get('/admins', async (req: any, res) => {
    const people: People = req.people;
    const accounts = await manageAccount('admin', people.university)
    console.log(accounts)
    res.send(accounts);
})

accountsRouter.get('/students', async (req: any, res) => {
    const people: People = req.people;

    const accounts = await manageAccount('student', people.university)
    console.log(accounts)
    res.send(accounts);
})

accountsRouter.get('/faculties', async (req: any, res) => {
    const people: People = req.people;

    const accounts = await manageAccount('faculty', people.university)
    console.log(accounts)
    res.send(accounts);
})

accountsRouter.get('/staff', async (req: any, res) => {
    const people: People = req.people;

    const accounts = await manageAccount('staff', people.university)
    console.log(accounts)
    res.send(accounts);
})

accountsRouter.post('/code', async (req: any, res) => {
    const { error } = ValidationSchemas.code.validate(req.body);
    if (error)
        return res.status(400).send(error.message)
    const { role } = req.body;
    const result = await PeopleSQL.GenerateCode(role);
    res.send({ code: result })
})

const manageAccount = async (role: string, university_id: string): Promise<Account[]> => {
    const result: Account[] = await PeopleSQL.getAccounts(role, university_id);
    return result;
}



export default accountsRouter;