import { Router } from "express"
import connection from "../connection";
import { ValidationSchemas } from "../validation_schemas/validation_schemas";

const profileRouter = Router();

profileRouter.post('/register', async (req, res) => {
    console.log(req.body);
    const result = await ValidationSchemas.accountCreation.validateAsync(req.body);
    console.log(result);
    res.send(`profile1`)
})

profileRouter.put('/', (req, res) => {
    res.send(`updated profile`)
})

profileRouter.get('/', (req, res) => {
    res.send('profile new')
})



export default profileRouter;