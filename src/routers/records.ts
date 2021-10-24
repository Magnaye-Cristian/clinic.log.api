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
        rolesCount.push(buildNameValuePair(role, await PeopleSQL.totalNumberOfRole(role, admin.university_id)))

    const purposes = ['bp monitoring', 'check-up', 'consultation', 'emergency case', 'first aid', 'medical', 'medicine', 'others']
    let purposesCount: any = [];
    for (const purpose of purposes)
        purposesCount.push(buildNameValuePair(purpose, await PeopleSQL.totalNumberOfPurpose(purpose, admin.university_id)))

    dashboard.roles = rolesCount;
    dashboard.purposes = purposesCount;
    console.log(dashboard)
    res.send(dashboard)
})

// recordsRouter.get('/tally', (req, res) => {
//     res.send('tally')
// })

// recordsRouter.get('/records', (req, res) => {
//     res.send('records')
// })

const buildNameValuePair = (name: string, value: string) => {
    return {
        "name": name,
        "value": value
    };
}
export default recordsRouter;