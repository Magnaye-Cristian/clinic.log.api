import { Router } from "express"
import connection from "../connection";
import { ValidationSchemas } from "../validation_schemas/validation_schemas";
import { People } from "../models/people.models";
import { Validators } from "../validation/validators";
const profileRouter = Router();
// const errorTool = (error: any, res: any) => {
//     if (error) {
//         console.log('error')
//         res.status(400);
//         return res.send(error.message)
//     }
// }
profileRouter.post('/register', async (req, res) => {
    const { error, value } = ValidationSchemas.accountCreation.validate(req.body);
    if (error) {
        console.log('error')
        res.status(400);
        return res.send(error.message)
    }
    const people: People = value;
    const isValidCode = await Validators.ValidateCode(people.code);
    const isValidSchoolId = await Validators.ValidateSchoolIdIfUnique(people.schoolId, people.university);
    if (!isValidCode || !isValidSchoolId) {
        console.log('something went wrong, contact system admin')
        res.status(400)
        return res.send('invalid code')
    }

    connection.query(`
        INSERT INTO Peoples
        (role, 
        university_id,
        password, 
        department_id, 
        program_id, 
        school_id, 
        first_name, 
        last_name, 
        middle_name, 
        created_on, 
        status)
        VALUES
        (?,?,?,?,?,?,?,?,?, NOW(), "active")`,
        [
            people.role,
            people.university,
            people.password,
            people.department,
            people.program,
            people.schoolId,
            people.first_name,
            people.last_name,
            people.middle_name
        ], (error, results, fields) => {
            if (error) throw error;
            // ...
        });
    res.send(`success`)
})

profileRouter.put('/', (req, res) => {
    res.send(`updated profile`)
})

profileRouter.get('/:schoolId', (req, res) => {
    const { schoolId } = req.params;
    /**
     * get from token the school of the admin
     * pass the school here
     * pass 2 identifier, one is school one is schoolid
     * if greater than 2 results then goodluck
     */

    res.send('profile new')
    connection.query('SELECT * FROM Peoples WHERE id = ?', [schoolId], function (error, results, fields) {
        if (error) throw error;
        // ...
        console.log(results)
        console.log('fields')
        console.log(results)
    });
})



export default profileRouter;