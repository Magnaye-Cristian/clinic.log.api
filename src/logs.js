"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
router.post('/', function (req, res) {
    res.send('logbook');
});
router.get('/', function (req, res) {
    res.send('');
});
router.delete('/:id', function (req, res) {
    res.send('');
});
router.put('/', function (req, res) {
});
