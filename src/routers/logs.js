"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var log_sql_1 = require("../sql_commands/log.sql");
var validation_schemas_1 = require("../validation_schemas/validation_schemas");
var logsRouter = (0, express_1.Router)();
var success = { message: 'success' };
logsRouter.post('/', function (req, res) {
    var logsCreate = req.body;
    var error = validation_schemas_1.ValidationSchemas.logsCreate.validate(logsCreate).error;
    if (error)
        return res.status(500).send(error.message);
    //university is from admins account
    var admin = req.people;
    logsCreate = logsCreate;
    console.log(logsCreate);
    if (!logsCreate.school_id)
        logsCreate.school_id = null;
    logsCreate.university_id = admin.university_id;
    var logs = log_sql_1.LogSQL.create(logsCreate);
    res.send(logs);
});
logsRouter.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var admin, logs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                admin = req.people;
                return [4 /*yield*/, log_sql_1.LogSQL.getAllByUniversity(admin.university_id)];
            case 1:
                logs = _a.sent();
                res.send(logs);
                return [2 /*return*/];
        }
    });
}); });
logsRouter.get('/notimeout', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var admin, logs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                admin = req.people;
                return [4 /*yield*/, log_sql_1.LogSQL.getAllByUniversityAndNullTimeout(admin.university_id)];
            case 1:
                logs = _a.sent();
                res.send(logs);
                return [2 /*return*/];
        }
    });
}); });
logsRouter.post('/timeoutLog', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error, admin, id, logs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                error = validation_schemas_1.ValidationSchemas.logId.validate(req.body).error;
                admin = req.people;
                if (error)
                    return [2 /*return*/, res.status(500).send({ message: error.message })];
                id = req.body.id;
                return [4 /*yield*/, log_sql_1.LogSQL.timeout(admin.university_id, id)
                    // pass id of timeout log
                ];
            case 1:
                logs = _a.sent();
                // pass id of timeout log
                res.send(success);
                return [2 /*return*/];
        }
    });
}); });
logsRouter.get('/tally', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var admin, error, date, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                admin = req.people;
                error = validation_schemas_1.ValidationSchemas.logTally.validate(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).send({ message: error.message })];
                date = req.body;
                return [4 /*yield*/, log_sql_1.LogSQL.tally(admin.university_id, date.month, date.year)];
            case 1:
                results = _a.sent();
                res.send(results);
                return [2 /*return*/];
        }
    });
}); });
logsRouter.put('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var admin, error, log, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                admin = req.people;
                error = validation_schemas_1.ValidationSchemas.logUpdate.validate(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).send({ message: error.message })];
                log = req.body;
                return [4 /*yield*/, log_sql_1.LogSQL.update(log, admin.university_id)];
            case 1:
                results = _a.sent();
                res.send(success);
                return [2 /*return*/];
        }
    });
}); });
exports.default = logsRouter;
