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
import cors from 'cors';
import { SchoolSQL } from './sql_commands/school.sql';

const app = express();
const router = Router();
const prependApi = '/api/';
app.use(cors())
app.use(express.json());
const allowedOrigins = ['http://localhost:4200']
const allowedHeaders = ['x-auth-token']
const options: cors.CorsOptions = {
    origin: allowedOrigins,
    allowedHeaders: allowedHeaders,
    exposedHeaders: allowedHeaders
}
app.use(cors(options));
router.use(`${prependApi}records`, [auth, admin], recordsRouter)
router.use(`${prependApi}logs`, [auth, admin], logsRouter);
router.use(`${prependApi}accounts`, [auth, admin], accountsRouter);
router.use(`${prependApi}profile`, auth, profileRouter);
app.use(router);


app.post(`/api/university`, (req, res) => {
    const university = req.body;
    //javascript destructuring
    const { error, value } = ValidationSchemas.universityName.validate(university);
    if (error)
        return res.send(error.message)
    SchoolSQL.createUniversity(university.name);
    console.log(university);
    res.send(`successful`)
})

app.post(`/api/program`, (req, res) => {
    const program = req.body;
    const { error, value } = ValidationSchemas.programName.validate(program);
    if (error)
        return res.send(error.message)
    SchoolSQL.createProgram(program.name)
    console.log(program);
    res.send(`successful`)
})

app.post(`${prependApi}authenticate`, async (req, res) => {
    const login: Authenticate = req.body;
    console.log(login)
    const people = await PeopleSQL.login(login);

    if (!people) {
        res.status(400);
        return res.send('invalid credentials');
    }

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
    const isValidSchoolId = await PeopleSQL.ValidateSchoolIdIfUnique(people.school_id, people.university);

    if (!isValidCode || !isValidSchoolId) {
        res.status(400)
        return res.send('something went wrong')
    }

    const result = await PeopleSQL.create(people);

    console.log(result);
    res.send('successful')
})

app.listen(3000, () => {
    console.log('connected to port 3000')
})
