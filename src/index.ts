import express, { Router } from 'express';
import logsRouter from './routers/logs';
import accountsRouter from './routers/accounts';
import profileRouter from './routers/profile';
import connection from './connection';
import { Validators } from './validation/validators';
import { Login } from './models/login.model';
import { PeopleSQL } from './sql_commands/people';
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

// app.post('/api/authenticate', (req, res) => {
//     const request = req.body;
//     console.log(request)
//     res.send(request)
// })

app.post(`${prependApi}login`, async (req, res) => {
    /**
     * create token from here
     * return token
     */
    const login: Login = req.body;
    const isValidLogin = await PeopleSQL.ValidateLogin(login);
    if (!isValidLogin) {
        res.status(400);
        return res.send('invalid credentials');
    }
    console.log(login)
    // return data, might as well get data from validateLogin to avoid another lookup in database
    res.send(`login sucessful`)
})


app.get('/dashboard', async (req, res) => {
    const [row] = await (await connection).execute('select * from Universities');
    res.send(row)
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
