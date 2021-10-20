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
import { UniversitySQL } from './sql_commands/university.sql';

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

app.get(`/api/universities`, async (req, res) => {
    const universities = await UniversitySQL.getAllUniversity();
    console.log(`universities`)
    console.log(universities)
    res.send(universities)
})
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
const tokenGenerator = (people: People) => {
    const privateKey = process.env.CLINIC_LOG_JWT_PRIVATE_KEY as string;
    const token = jwt.sign(people, privateKey);
    return { header: 'x-auth-token', token: token }
}
app.post(`${prependApi}authenticate`, async (req, res) => {
    const login: Authenticate = req.body;
    console.log(login)
    // check if university is existing
    const university = await UniversitySQL.getUniversity(login.university)
    if (!university)
        return res.status(400).send({ message: 'invalid credentials' })
    const people = await PeopleSQL.login(login, university.id);

    if (!people) {
        res.status(400);
        return res.send({ message: 'invalid credentials' });
    }
    const tokenGen = tokenGenerator(people);
    res.header(tokenGen.header, tokenGen.token).send(people)
})

app.post(`${prependApi}register`, async (req, res) => {
    const { error, value } = ValidationSchemas.accountCreation.validate(req.body);
    if (error) {
        console.log('error')
        res.status(400);
        return res.send(error.message)
    }

    const people: People = value;

    const isValidCode = await PeopleSQL.ValidateCode(people.code, people.role);
    const isValidSchoolId = await PeopleSQL.ValidateSchoolIdIfUnique(people.school_id, people.university_id);
    if (!isValidCode) {
        res.status(400)
        res.send('Invalid code')
    }

    if (!isValidSchoolId) {
        res.status(400)
        return res.send('School Id already exists')
    }

    const result = await PeopleSQL.create(people);

    console.log(result);
    const tokenGen = tokenGenerator(people);
    res.header(tokenGen.header, tokenGen.token).send(people)
})

app.listen(3000, () => {
    console.log('connected to port 3000')
})
