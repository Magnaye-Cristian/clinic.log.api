import { Router } from 'express'
import connection from '../connection';

const recordsRouter = Router();
recordsRouter.get('/dashboard', async (req, res) => {
    const [row] = await (await connection).execute('select * from Universities');
    res.send(row)
})

recordsRouter.get('/tally', (req, res) => {
    res.send('tally')
})

recordsRouter.get('/records', (req, res) => {
    res.send('records')
})


export default recordsRouter;