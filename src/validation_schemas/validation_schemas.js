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
    ValidationSchemas.accountCreation = joi_1.default.object({
        role: joi_1.default.number().required(),
        // university: Joi.number().required(),
        // password: Joi.string().max(10),
        // department: Joi.number(),
        // program: Joi.number(),
        // schoolId: Joi.number(),
        // validCode: Joi.string()
    });
    return ValidationSchemas;
}());
exports.ValidationSchemas = ValidationSchemas;
