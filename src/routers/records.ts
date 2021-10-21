import { Router } from 'express'
import connection from '../connection';
import { People } from '../models/people.models';
import { PeopleSQL } from '../sql_commands/people.sql';

const recordsRouter = Router();
recordsRouter.get('/dashboard', async (req: any, res) => {
    // const [row] = await (await connection).execute('select * from Universities');
    // res.send(row)
    const admin: People = req.people;
    const dashboard: any = {}
    const roles = ['admin', 'staff', 'faculty', 'student'];
    let rolesCount: any = [];
    for (const role of roles)
        rolesCount.push({
            "name": role,
            "value": await PeopleSQL.totalNumberOfRole(role, admin.university_id)
        });

    dashboard.roles = rolesCount;

    console.log(rolesCount)
    res.send(rolesCount)
})

// recordsRouter.get('/tally', (req, res) => {
//     res.send('tally')
// })

// recordsRouter.get('/records', (req, res) => {
//     res.send('records')
// })


export default recordsRouter;