import { Router } from "express"
import connection from "../connection";
import { ValidationSchemas } from "../validation_schemas/validation_schemas";
import { People } from "../models/people.models";
import { Validators } from "../validation/validators";
import { PeopleSQL } from "../sql_commands/people.sql";

const profileRouter = Router();
// const errorTool = (error: any, res: any) => {
//     if (error) {
//         console.log('error')
//         res.status(400);
//         return res.send(error.message)
//     }
// }

profileRouter.put('/', (req, res) => {
    res.send(`updated profile`)
})

// profileRouter.get('/:schoolId', (req, res) => {
//     const { schoolId } = req.params;
//     /**
//      * get from token the school of the admin
//      * pass the school here
//      * pass 2 identifier, one is school one is schoolid
//      * if greater than 2 results then goodluck
//      */

//     res.send('profile new')
//     connection.query('SELECT * FROM Peoples WHERE id = ?', [schoolId], function (error, results, fields) {
//         if (error) throw error;
//         // ...
//         console.log(results)
//         console.log('fields')
//         console.log(results)
//     });
// })



export default profileRouter;