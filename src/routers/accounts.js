"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var accountsRouter = (0, express_1.Router)();
accountsRouter.post('/deactivate', function (req, res) {
    res.send('');
});
accountsRouter.get('/admins', function (req, res) {
    res.send('admins1');
});
accountsRouter.get('/students', function (req, res) {
    res.send();
});
accountsRouter.get('/faculties', function (req, res) {
});
accountsRouter.get('/staff', function (req, res) {
});
exports.default = accountsRouter;
