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
        role: joi_1.default.number().required(),
        university: joi_1.default.number().required(),
        password: joi_1.default.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).message("\n        At least one upper case English letter,\n        At least one lower case English letter,\n        At least one digit,\n        At least one special character,\n        Minimum eight in length\n        "),
        department: joi_1.default.number(),
        program: joi_1.default.number(),
        schoolId: joi_1.default.number(),
        validCode: joi_1.default.string()
    });
    return ValidationSchemas;
}());
exports.ValidationSchemas = ValidationSchemas;
