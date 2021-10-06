import { Router } from "express";

const logsRouter = Router();

logsRouter.post('/', (req, res) => {
    res.send('logbook')
})

logsRouter.get('/', (req, res) => {
    res.send('logsget')
})
logsRouter.get('/notimeout', (req, res) => {
    res.send('')
})
logsRouter.post('/timeoutLog', (req, res) => {
    res.send('')

})
logsRouter.get('/', (req, res) => {
    res.send('')
})
logsRouter.put('/', (req, res) => {

})

export default logsRouter;