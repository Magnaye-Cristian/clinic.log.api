import { Router } from 'express'
import { string } from 'joi';
import connection from '../connection';
import { People } from '../models/people.models';
import { PeopleSQL } from '../sql_commands/people.sql';

const recordsRouter = Router();
recordsRouter.get('/purpose', async (req: any, res) => {
    const admin: People = req.people;
    const month = req.query.month;
    const year = req.query.year;
    console.log(month)
    console.log(year)
    let dashboard: any;

    const purposes = ['bp monitoring', 'check-up', 'consultation', 'emergency case', 'first aid', 'medical', 'medicine', 'others']
    let purposesCount: any = [];
    for (const purpose of purposes)
        purposesCount.push(buildNameValuePair(purpose, await PeopleSQL.totalNumberOfPurpose(purpose, admin.university_id, month, year)))

    dashboard = purposesCount;
    console.log(dashboard)
    res.send(dashboard)
})

recordsRouter.get('/roles', async (req: any, res) => {
    const admin: People = req.people;
    let rolesCount: any = [];
    const roles = ['admin', 'staff', 'faculty', 'student'];

    for (const role of roles)
        rolesCount.push(buildNameValuePair(role, await PeopleSQL.totalNumberOfRole(role, admin.university_id)))

    res.send(rolesCount);
})


recordsRouter.get('/monthlycomplaints/:year', async (req: any, res) => {
    const year = req.params.year;
    console.log(`year`)
    const complaints = ['Abdominal Pain', 'Allergy', 'headache', 'Body Malaise', 'Chest Pain',
        'Cold', 'Dysmenorrhea', 'Headache', 'Nausea', 'Skin Rash', 'Sore Throat', 'Sprain', 'Vomiting', 'Wound', 'Others'];
    const admin: People = req.people
    let monthlyComplaints: any;
    let returnObject: { name: string, series: any[] }[] = [];
    for (const complaint of complaints) {
        // sql group by month
        returnObject.push({
            name: complaint,
            series: await PeopleSQL.totalNumberOfComplaintsInNYearGroupByMonths(complaint, admin.university_id, year) as any[]
        })
    }
    console.log(`-----------`)
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    for (const r in returnObject) {
        let { series } = returnObject[r];
        console.log(series)
        for (const monthName of monthNames) {
            const found = series.find(x => x.name === monthName)
            if (!found)
                series.push({ name: monthName, value: 0 })
        }
    }

    res.send(returnObject)
})

const buildNameValuePair = (name: string, value: string) => {
    return {
        "name": name,
        "value": value
    };
}
export default recordsRouter;