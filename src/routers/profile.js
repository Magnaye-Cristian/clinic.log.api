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
var validation_schemas_1 = require("../validation_schemas/validation_schemas");
var people_sql_1 = require("../sql_commands/people.sql");
var profileRouter = (0, express_1.Router)();
// const errorTool = (error: any, res: any) => {
//     if (error) {
//         console.log('error')
//         res.status(400);
//         return res.send(error.message)
//     }
// }
profileRouter.put('/', function (req, res) {
    var error = validation_schemas_1.ValidationSchemas.peopleUpdate.validate(req.body).error;
    if (Object.keys(req.body).length < 1)
        return res.status(500).send('request is empty');
    console.log('put profile');
    if (error)
        return res.status(400).send(error.message);
    var people = req.people;
    console.log(people);
    if (!people) {
        return res.status(500).send('something went wrong');
    }
    var peopleUpdate = req.body;
    peopleUpdate.school_id = people.school_id;
    peopleUpdate.university_id = people.university_id;
    console.log(req.body);
    people_sql_1.PeopleSQL.update(peopleUpdate);
    res.send({});
});
profileRouter.get('/me', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var people, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('me');
                people = req.people;
                if (!people) {
                    return [2 /*return*/, res.status(500).send('something went wrong')];
                }
                console.log(people);
                return [4 /*yield*/, people_sql_1.PeopleSQL.get(people.school_id, people.university_id)];
            case 1:
                result = _a.sent();
                console.log(result);
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
exports.default = profileRouter;
