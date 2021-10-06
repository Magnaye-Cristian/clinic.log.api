import { Router } from "express"
import connection from "../connection";

const profileRouter = Router();

profileRouter.post('/', (req, res) => {
    console.log(req)
    connection.query('')
    res.send(`profile1`)
})

profileRouter.put('/', (req, res) => {
    res.send(`updated profile`)
})

profileRouter.get('/', (req, res) => {
    res.send('profile new')
})

export default profileRouter;