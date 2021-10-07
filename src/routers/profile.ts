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
    console.log(value);
    res.send(`success`)
})

profileRouter.put('/', (req, res) => {
    res.send(`updated profile`)
})

profileRouter.get('/', (req, res) => {
    res.send('profile new')
})



export default profileRouter;