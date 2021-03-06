"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importStar(require("express"));
var logs_1 = __importDefault(require("./routers/logs"));
var accounts_1 = __importDefault(require("./routers/accounts"));
var profile_1 = __importDefault(require("./routers/profile"));
var people_sql_1 = require("./sql_commands/people.sql");
var process_1 = __importDefault(require("process"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var auth_1 = __importDefault(require("./middlewares/auth"));
var admin_1 = __importDefault(require("./middlewares/admin"));
var validation_schemas_1 = require("./validation_schemas/validation_schemas");
var records_1 = __importDefault(require("./routers/records"));
var cors_1 = __importDefault(require("cors"));
var school_sql_1 = require("./sql_commands/school.sql");
var university_sql_1 = require("./sql_commands/university.sql");
var app = (0, express_1.default)();
var router = (0, express_1.Router)();
var prependApi = '/api/';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var allowedOrigins = ['http://localhost:4200'];
var allowedHeaders = ['x-auth-token'];
var options = {
    origin: allowedOrigins,
    allowedHeaders: allowedHeaders,
    exposedHeaders: allowedHeaders
};
app.use((0, cors_1.default)(options));
router.use(prependApi + "dashboard", [auth_1.default, admin_1.default], records_1.default);
router.use(prependApi + "logs", [auth_1.default, admin_1.default], logs_1.default);
router.use(prependApi + "accounts", [auth_1.default, admin_1.default], accounts_1.default);
router.use(prependApi + "profile", auth_1.default, profile_1.default);
app.use(router);
app.get("/api/universities", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var universities;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, university_sql_1.UniversitySQL.getAllUniversity()];
            case 1:
                universities = _a.sent();
                console.log("universities");
                console.log(universities);
                res.send(universities);
                return [2 /*return*/];
        }
    });
}); });
app.post("/api/university", function (req, res) {
    var university = req.body;
    //javascript destructuring
    var _a = validation_schemas_1.ValidationSchemas.universityName.validate(university), error = _a.error, value = _a.value;
    if (error)
        return res.send(error.message);
    school_sql_1.SchoolSQL.createUniversity(university.name);
    console.log(university);
    res.send("successful");
});
app.post("/api/program", function (req, res) {
    var program = req.body;
    var _a = validation_schemas_1.ValidationSchemas.programName.validate(program), error = _a.error, value = _a.value;
    if (error)
        return res.send(error.message);
    school_sql_1.SchoolSQL.createProgram(program.name);
    console.log(program);
    res.send("successful");
});
var tokenGenerator = function (people) {
    var privateKey = process_1.default.env.CLINIC_LOG_JWT_PRIVATE_KEY;
    var token = jsonwebtoken_1.default.sign(people, privateKey);
    return { header: 'x-auth-token', token: token };
};
app.post(prependApi + "authenticate", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var login, university, people, tokenGen;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                login = req.body;
                console.log(login);
                return [4 /*yield*/, university_sql_1.UniversitySQL.getUniversity(login.university)];
            case 1:
                university = _a.sent();
                if (!university)
                    return [2 /*return*/, res.status(400).send({ message: 'invalid credentials' })];
                return [4 /*yield*/, people_sql_1.PeopleSQL.login(login, university.id)];
            case 2:
                people = _a.sent();
                if (!people) {
                    res.status(400);
                    return [2 /*return*/, res.send({ message: 'invalid credentials' })];
                }
                tokenGen = tokenGenerator(people);
                res.header(tokenGen.header, tokenGen.token).send(people);
                return [2 /*return*/];
        }
    });
}); });
app.post(prependApi + "register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error, value, registerDTO, isValidCode, university, isValidSchoolId, people, result, tokenGen;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = validation_schemas_1.ValidationSchemas.accountCreation.validate(req.body), error = _a.error, value = _a.value;
                if (error) {
                    console.log('error');
                    res.status(400);
                    return [2 /*return*/, res.send(error.message)];
                }
                registerDTO = value;
                return [4 /*yield*/, people_sql_1.PeopleSQL.ValidateCode(registerDTO.code, registerDTO.role)];
            case 1:
                isValidCode = _b.sent();
                return [4 /*yield*/, university_sql_1.UniversitySQL.getUniversity(registerDTO.university)];
            case 2:
                university = _b.sent();
                if (!university) {
                    res.status(400).send({ message: 'invalid university' });
                }
                return [4 /*yield*/, people_sql_1.PeopleSQL.ValidateSchoolIdIfUnique(registerDTO.school_id, university === null || university === void 0 ? void 0 : university.id)];
            case 3:
                isValidSchoolId = _b.sent();
                if (!isValidCode) {
                    res.status(400);
                    res.send('Invalid code');
                    return [2 /*return*/];
                }
                if (!isValidSchoolId) {
                    res.status(400);
                    return [2 /*return*/, res.send({ message: 'School Id already exists' })];
                }
                people = {
                    role: registerDTO.role,
                    university_id: university === null || university === void 0 ? void 0 : university.id,
                    password: registerDTO.password,
                    first_name: registerDTO.first_name,
                    last_name: registerDTO.last_name,
                    middle_name: registerDTO.middle_name,
                    department: registerDTO.department,
                    program: registerDTO.program,
                    school_id: registerDTO.school_id,
                    status: registerDTO.status,
                    code: registerDTO.code
                };
                return [4 /*yield*/, people_sql_1.PeopleSQL.create(people)];
            case 4:
                result = _b.sent();
                console.log(result);
                tokenGen = tokenGenerator(people);
                res.header(tokenGen.header, tokenGen.token).send(registerDTO);
                return [2 /*return*/];
        }
    });
}); });
app.listen(3000, function () {
    console.log('connected to port 3000');
});
