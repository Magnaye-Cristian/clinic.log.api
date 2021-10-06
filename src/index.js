"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importStar(require("express"));
var logs_1 = __importDefault(require("./router/logs"));
var accounts_1 = __importDefault(require("./router/accounts"));
var profile_1 = __importDefault(require("./router/profile"));
var connection_1 = __importDefault(require("./connection"));
var app = (0, express_1.default)();
var router = (0, express_1.Router)();
var prependApi = '/api/';
router.use(prependApi + "logs", logs_1.default);
router.use(prependApi + "accounts", accounts_1.default);
router.use(prependApi + "profiles", profile_1.default);
app.use(router);
/**
 * implement
 *  authentication
 *  authorization - what endpoints does a user have access
 */
app.post('api/authenticate', function (req, res) {
    res.send('well done, i asd1');
});
app.post('/login', function (req, res) {
    res.send("login");
});
app.post(prependApi + "register", function (req, res) {
    res.send('register1');
});
app.get('/dashboard', function (req, res) {
    var result = connection_1.default.query('select * from Universities', function (err, result) {
        console.log(result);
    });
    res.send('');
});
app.get('/tally', function (req, res) {
    res.send('tally');
});
app.get('/records', function (req, res) {
    res.send('records');
});
app.listen(3000, function () {
    console.log('test12311.');
});
