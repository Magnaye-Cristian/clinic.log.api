"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var connection_1 = __importDefault(require("../connection"));
var profileRouter = (0, express_1.Router)();
profileRouter.post('/', function (req, res) {
    console.log(req);
    connection_1.default.query('');
    res.send("profile1");
});
profileRouter.put('/', function (req, res) {
    res.send("updated profile");
});
profileRouter.get('/', function (req, res) {
    res.send('profile new');
});
exports.default = profileRouter;
