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
logsRouter.delete('/:id', function (req, res) {
    res.send('');
});
logsRouter.put('/', function (req, res) {
});
exports.default = logsRouter;
