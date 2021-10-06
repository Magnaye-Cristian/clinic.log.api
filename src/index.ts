import express, { Router } from 'express';
import logsRouter from './routers/logs';
import accountsRouter from './routers/accounts';
import profileRouter from './routers/profile';
import connection from './connection';

const app = express();
const router = Router();
const prependApi = '/api/';
app.use(express.json());
router.use(`${prependApi}logs`, logsRouter);
router.use(`${prependApi}accounts`, accountsRouter);
router.use(`${prependApi}profiles`, profileRouter);
app.use(router);
/**
 * implement 
 *  authentication
 *  authorization - what endpoints does a user have access
 */

app.post('/api/authenticate', (req, res) => {
    const request = req.body;
    console.log(request)
    res.send(request)
})

app.post('/login', (req, res) => {
    res.send(`login`)
})


app.get('/dashboard', (req, res) => {
    const result = connection.query('select * from Universities', (err, result) => {
        console.log(result)
    })
    res.send('')
})

app.get('/tally', (req, res) => {
    res.send('tally')
})

app.get('/records', (req, res) => {
    res.send('records')
})

app.listen(3000, () => {
    console.log('test12311.')
})
