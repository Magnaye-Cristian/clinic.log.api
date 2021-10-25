"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationSchemas = void 0;
var joi_1 = __importDefault(require("joi"));
var ValidationSchemas = /** @class */ (function () {
    function ValidationSchemas() {
    }
    // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    // password regex
    // This regex will enforce these rules:
    // At least one upper case English letter, (?=.*?[A-Z])
    // At least one lower case English letter, (?=.*?[a-z])
    // At least one digit, (?=.*?[0-9])
    // At least one special character, (?=.*?[#?!@$%^&*-])
    // Minimum eight in length .{8,} (with the anchors)
    ValidationSchemas.accountCreation = joi_1.default.object({
        role: joi_1.default.valid('student', 'faculty', 'staff', 'admin', 'head admin').required(),
        university: joi_1.default.string().required(),
        password: joi_1.default.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).message("\n        At least one upper case English letter,\n        At least one lower case English letter,\n        At least one digit,\n        At least one special character,\n        Minimum eight in length\n        ").required(),
        first_name: joi_1.default.string().required().max(30),
        last_name: joi_1.default.string().required().max(30),
        middle_name: joi_1.default.string().required().max(30),
        department: joi_1.default.string().required(),
        program: joi_1.default.string().required(),
        school_id: joi_1.default.string().required(),
        code: joi_1.default.string().required()
    });
    ValidationSchemas.peopleUpdate = joi_1.default.object({
        first_name: joi_1.default.string(),
        last_name: joi_1.default.string(),
        middle_name: joi_1.default.string(),
        department: joi_1.default.string(),
        program: joi_1.default.string(),
        password: joi_1.default.string(),
    });
    ValidationSchemas.deactivate = joi_1.default.object({
        school_id: joi_1.default.string().required()
    });
    ValidationSchemas.code = joi_1.default.object({
        number_of_codes: joi_1.default.number().required(),
        role: joi_1.default.valid('student', 'faculty', 'staff', 'admin', 'head admin').required()
    });
    ValidationSchemas.universityName = joi_1.default.object({
        name1: joi_1.default.string().required()
    });
    ValidationSchemas.programName = joi_1.default.object({
        program: joi_1.default.string().required()
    });
    ValidationSchemas.role = joi_1.default.object({
        role: joi_1.default.string().required()
    });
    ValidationSchemas.logsCreate = joi_1.default.object({
        //school id is not required cause a guess does not have a schoolid
        people_id: joi_1.default.number(),
        school_id: joi_1.default.string().empty(''),
        type: joi_1.default.string().valid('university', 'non-university').required(),
        type_spec: joi_1.default.string().valid('guardian', 'parent', 'visitor', 'guest', 'others').empty(''),
        department: joi_1.default.string().empty(''),
        first_name: joi_1.default.string().required(),
        last_name: joi_1.default.string().required(),
        middle_name: joi_1.default.string().required(),
        address: joi_1.default.string().empty(''),
        purpose: joi_1.default.string().valid('bp monitoring', 'check-up', 'consultation', 'emergency case', 'first aid', 'medical', 'medicine', 'others').required(),
        complaint: joi_1.default.string().valid('abdominal pain', 'allergy', 'body malaise', 'chest pain', 'cold', 'dysmenorrhea', 'headache', 'nausea', 'skin rash', 'sprain', 'vomiting', 'wound', 'others').required()
    });
    ValidationSchemas.logId = joi_1.default.object({
        id: joi_1.default.number().required()
    });
    ValidationSchemas.logTally = joi_1.default.object({
        month: joi_1.default.number().required(),
        year: joi_1.default.number().required()
    });
    ValidationSchemas.logUpdate = joi_1.default.object({
        id: joi_1.default.number().required(),
        type: joi_1.default.string().valid('university', 'non-university'),
        type_spec: joi_1.default.string().valid('guardian', 'parent', 'visitor', 'guest', 'others'),
        department: joi_1.default.string().empty(''),
        first_name: joi_1.default.string().empty(''),
        last_name: joi_1.default.string().empty(''),
        middle_name: joi_1.default.string().empty(''),
        address: joi_1.default.string().empty(''),
        purpose: joi_1.default.string().valid('bp monitoring', 'check-up', 'consultation', 'emergency case', 'first aid', 'medical', 'medicine', 'others'),
        complaint: joi_1.default.string().valid('abdominal pain', 'allergy', 'body malaise', 'chest pain', 'cold', 'dysmenorrhea', 'headache', 'nausea', 'skin rash', 'sprain', 'vomiting', 'wound', 'others')
    });
    return ValidationSchemas;
}());
exports.ValidationSchemas = ValidationSchemas;
