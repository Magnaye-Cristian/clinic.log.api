import { Router } from "express"
import connection from "../connection";
import { ValidationSchemas } from "../validation_schemas/validation_schemas";

const profileRouter = Router();
// const errorTool = (error: any, res: any) => {
//     if (error) {
//         console.log('error')
//         res.status(400);
//         return res.send(error.message)
//     }
// }
profileRouter.post('/register', (req, res) => {
    const { error, value } = ValidationSchemas.accountCreation.validate(req.body);
    if (error) {
        console.log('error')
        res.status(400);
        return res.send(error.message)
    }
    /**
     * check if validcode is valid
     * else return 400 error something went wrong   
     * then insert
     *  predefined column values
     * CREATEDON
     * STATUS = ACTIVE
     * 
     */

    connection.query(`INSERT INTO Peoples
    (role, university_id, password, department_id, program_id, school_id, first_name, last_name, middle_name, created_on, status)
    VALUES
    ("student",1,"password1",1,1,1,"firstnamefromserver","lastname","middlename", NOW(), "active")`, [], (error, results, fields) => {
        if (error) throw error;
        // ...

    });
    console.log(value);
    res.send(`success`)
})

profileRouter.put('/', (req, res) => {
    res.send(`updated profile`)
})
// I don't think schoolId is unique
profileRouter.get('/:schoolId', (req, res) => {
    const { schoolId } = req.params;
    /**
     * get from token the school of the admin
     * pass the school here
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