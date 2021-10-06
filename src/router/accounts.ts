import { Router } from "express";

const accountsRouter = Router();

accountsRouter.post('/deactivate', (req, res) => {
    res.send('')
})

accountsRouter.get('/admins', (req, res) => {
    res.send('admins1')
})

accountsRouter.get('/students', (req, res) => {
    res.send()
})

accountsRouter.get('/faculties', (req, res) => {

})

accountsRouter.get('/staff', (req, res) => {

})



export default accountsRouter;