import { Router } from "express"
import connection from "../connection";
import { ValidationSchemas } from "../validation_schemas/validation_schemas";
import { People } from "../models/people.models";
import { Validators } from "../validation/validators";
import { PeopleSQL } from "../sql_commands/people.sql";
import { PeopleUpdate } from "../models/people-update.model";
import { profile } from "console";
import { UniversitySQL } from '../sql_commands/university.sql';

const success = { message: 'success' }
const profileRouter = Router();
// const errorTool = (error: any, res: any) => {
//     if (error) {
//         console.log('error')
//         res.status(400);
//         return res.send(error.message)
//     }
// }

profileRouter.put('/', async (req: any, res) => {
    const { error } = ValidationSchemas.peopleUpdate.validate(req.body);
    if (Object.keys(req.body).length < 1) return res.status(500).send('request is empty')
    console.log('put profile')
    if (error) return res.status(400).send(error.message)

    const people: People = req.people;
    console.log(people)
    if (!people) {
        return res.status(500).send('something went wrong');
    }
    const peopleUpdate: PeopleUpdate = req.body;
    console.log(`p`)
    console.log(peopleUpdate)
    peopleUpdate.school_id = people.school_id;
    peopleUpdate.university_id = people.university_id;

    console.log(req.body)
    const result = await PeopleSQL.update(peopleUpdate);
    res.send(success)
})

profileRouter.get('/me', async (req: any, res) => {
    console.log('me')
    const people: People = req.people;
    if (!people) {
        return res.status(500).send('something went wrong');
    }
    console.log(people)
    let returnValue: any = {};
    const result = await PeopleSQL.get(people.school_id, people.university_id);
    const university = await UniversitySQL.getUniversityById(people.university_id);
    returnValue = {
        ...result,
        university: (university as any).name
    }
    console.log(returnValue)
    res.send(returnValue)
})



export default profileRouter;