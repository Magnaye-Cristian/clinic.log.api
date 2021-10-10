import { Router } from "express"
import connection from "../connection";
import { ValidationSchemas } from "../validation_schemas/validation_schemas";
import { People } from "../models/people.models";
import { Validators } from "../validation/validators";
import { PeopleSQL } from "../sql_commands/people.sql";
import { PeopleUpdate } from "../models/people-update.model";

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
    if (error) return res.status(400).send(error.message)

    const people: People = req.people;
    console.log(people)
    if (!people) {
        return res.status(500).send('something went wrong');
    }
    const peopleUpdate: PeopleUpdate = req.body;
    peopleUpdate.school_id = people.school_id;
    peopleUpdate.university_id = people.university;

    console.log(req.body)
    PeopleSQL.update(peopleUpdate);
    res.send(`updated profile`)
})

profileRouter.get('/me', (req: any, res) => {
    const people: People = req.people;
    if (!people) {
        return res.status(500).send('something went wrong');
    }


    /**
     * get from token the school of the admin
     * pass the school here
     * pass 2 identifier, one is school one is schoolid
     * if greater than 2 results then goodluck
     */

    res.send('profile new')
    // connection.query('SELECT * FROM Peoples WHERE id = ?', [schoolId], function (error, results, fields) {
    //     if (error) throw error;
    //     // ...
    //     console.log(results)
    //     console.log('fields')
    //     console.log(results)
    // });
})



export default profileRouter;