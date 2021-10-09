import express, { Router } from 'express';
import logsRouter from './routers/logs';
import accountsRouter from './routers/accounts';
import profileRouter from './routers/profile';
import { Authenticate } from './models/authenticate.model';
import { PeopleSQL } from './sql_commands/people.sql';
import process from 'process';
import jwt from 'jsonwebtoken';
import auth from './middlewares/auth';
import admin from './middlewares/admin';
import { ValidationSchemas } from './validation_schemas/validation_schemas';
import { People } from './models/people.models';
import recordsRouter from './routers/records';
const app = express();
const router = Router();
const prependApi = '/api/';
app.use(express.json());
router.use(`${prependApi}records`, [auth, admin], recordsRouter)
router.use(`${prependApi}logs`, [auth, admin], logsRouter);
router.use(`${prependApi}accounts`, [auth, admin], accountsRouter);
router.use(`${prependApi}profiles`, auth, profileRouter);
app.use(router);

app.post(`${prependApi}authenticate`, async (req, res) => {
    const login: Authenticate = req.body;
    const people = await PeopleSQL.login(login);
    if (!people) {
        res.status(400);
        return res.send('invalid credentials');
    }
    console.log(login)
    console.log(`people`)
    console.log(people)
    const privateKey = process.env.CLINIC_LOG_JWT_PRIVATE_KEY as string;
    const token = jwt.sign(people, privateKey);
    res.header('x-auth-token', token).send(people)
})

app.post(`${prependApi}register`, async (req, res) => {
    const { error, value } = ValidationSchemas.accountCreation.validate(req.body);
    if (error) {
        console.log('error')
        res.status(400);
        return res.send(error.message)
    }

    const people: People = value;

    const isValidCode = await PeopleSQL.ValidateCode(people.code);
    const isValidSchoolId = await PeopleSQL.ValidateSchoolIdIfUnique(people.schoolId, people.university);
    if (!isValidCode || !isValidSchoolId) {
        console.log('something went wrong, contact system admin')
        res.status(400)
        return res.send('something went wrong')
    }

    const result = await PeopleSQL.create(people);


    console.log(result);
    res.send('successful')
})

app.listen(3000, () => {
    console.log('test12311.')
})
