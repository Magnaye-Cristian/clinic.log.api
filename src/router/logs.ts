import { Router } from "express";

const logsRouter = Router();

logsRouter.post('/', (req, res) => {
    res.send('logbook')
})

logsRouter.get('/', (req, res) => {
    res.send('logsget')
})
logsRouter.delete('/:id', (req, res) => {
    res.send('')

})

logsRouter.put('/', (req, res) => {

})

export default logsRouter;