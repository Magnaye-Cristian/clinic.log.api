"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var logsRouter = (0, express_1.Router)();
logsRouter.post('/', function (req, res) {
    res.send('logbook');
});
logsRouter.get('/', function (req, res) {
    res.send('logsget');
});
logsRouter.get('/notimeout', function (req, res) {
    res.send('');
});
logsRouter.post('/timeoutLog', function (req, res) {
    res.send('');
});
logsRouter.get('/', function (req, res) {
    res.send('');
});
logsRouter.put('/', function (req, res) {
});
exports.default = logsRouter;
