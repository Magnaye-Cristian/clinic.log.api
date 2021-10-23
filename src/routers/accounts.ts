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
    const results = await PeopleSQL.deactivate(accountToDeactivate.school_id, user.university_id);
    console.log(results)
    res.send('success')
})

accountsRouter.get('/admin', async (req: any, res) => {
    const people: People = req.people;

    const accounts = await manageAccount('admin', people.university_id)
    console.log(accounts)
    res.send(accounts);
})

accountsRouter.get('/student', async (req: any, res) => {
    const people: People = req.people;

    const accounts = await manageAccount('student', people.university_id)
    console.log(accounts)
    res.send(accounts);
})

accountsRouter.get('/faculty', async (req: any, res) => {
    const people: People = req.people;

    const accounts = await manageAccount('faculty', people.university_id)
    console.log(accounts)
    res.send(accounts);
})

accountsRouter.get('/staff', async (req: any, res) => {
    const people: People = req.people;

    const accounts = await manageAccount('staff', people.university_id)
    console.log(accounts)
    res.send(accounts);
})

accountsRouter.post('/code', async (req: any, res) => {
    const { error } = ValidationSchemas.code.validate(req.body);
    if (error)
        return res.status(400).send(error.message)
    const { role, number_of_codes } = req.body;
    let codes: { role: string, code: string }[] = []
    const admin: People = req.people;
    for (let i = 0; i < number_of_codes; i++) {
        const result = await PeopleSQL.GenerateCode(role, admin.university_id);
        codes.push({ role: role, code: result as string })
    }
    res.send(codes)
})

accountsRouter.get('/codes', async (req: any, res) => {
    // let codesR: { code: string, role: string, createdOn: Date }[] = [];
    const admin: People = req.people;
    const results = await PeopleSQL.getAllCodes(admin.university_id);
    console.log(results)
    res.send(results)
})

accountsRouter.get('/searchAll/:school_id', async (req: any, res) => {
    const school_id = req.params.school_id;
    console.log(`searchAll`)
    console.log(school_id)
    const people: People = req.people;
    const results = await PeopleSQL.get(school_id, people.university_id)
    console.log(results)
    res.send(results)
})

const manageAccount = async (role: string, university_id: number): Promise<Account[]> => {
    const result: Account[] = await PeopleSQL.getAccounts(role, university_id);
    return result;
}





export default accountsRouter;