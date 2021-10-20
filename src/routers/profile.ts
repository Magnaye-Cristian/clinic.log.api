import { Router } from "express"
import connection from "../connection";
import { ValidationSchemas } from "../validation_schemas/validation_schemas";
import { People } from "../models/people.models";
import { Validators } from "../validation/validators";
import { PeopleSQL } from "../sql_commands/people.sql";
import { PeopleUpdate } from "../models/people-update.model";
import { profile } from "console";

const profileRouter = Router();
// const errorTool = (error: any, res: any) => {
//     if (error) {
//         console.log('error')
//         res.status(400);
//         return res.send(error.message)
//     }
// }

profileRouter.put('/', (req: any, res) => {
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
    peopleUpdate.school_id = people.school_id;
    peopleUpdate.university_id = people.university_id;

    console.log(req.body)
    PeopleSQL.update(peopleUpdate);
    res.send({})
})

profileRouter.get('/me', async (req: any, res) => {
    console.log('me')
    const people: People = req.people;
    if (!people) {
        return res.status(500).send('something went wrong');
    }
    console.log(people)
    const result = await PeopleSQL.get(people.school_id, people.university_id);
    console.log(result)
    res.send(result)
})



export default profileRouter;