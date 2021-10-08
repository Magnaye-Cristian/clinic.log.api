import { Router } from "express"
import connection from "../connection";
import { ValidationSchemas } from "../validation_schemas/validation_schemas";

const profileRouter = Router();

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

    
    // connection.query('SELECT * FROM users WHERE id = ?', [userId], function (error, results, fields) {
    //     if (error) throw error;
    //     // ...
    //   });
    console.log(value);
    res.send(`success`)
})

profileRouter.put('/', (req, res) => {
    res.send(`updated profile`)
})
// I don't think schoolId is unique
profileRouter.get('/:schoolId', (req, res) => {
    const {schoolId} = req.params;

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