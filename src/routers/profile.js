"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var validation_schemas_1 = require("../validation_schemas/validation_schemas");
var profileRouter = (0, express_1.Router)();
profileRouter.post('/register', function (req, res) {
    var _a = validation_schemas_1.ValidationSchemas.accountCreation.validate(req.body), error = _a.error, value = _a.value;
    if (error) {
        console.log('error');
        res.status(400);
        return res.send(error.message);
    }
    console.log(value);
    res.send("success");
});
profileRouter.put('/', function (req, res) {
    res.send("updated profile");
});
profileRouter.get('/', function (req, res) {
    res.send('profile new');
});
exports.default = profileRouter;
