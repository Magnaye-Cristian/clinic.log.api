"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
var process_1 = __importDefault(require("process"));
var connection = mysql_1.default.createConnection({
    host: process_1.default.env.MEDLOG_DB_HOST,
    port: process_1.default.env.MEDLOG_DB_PORT,
    database: process_1.default.env.MEDLOG_DB_NAME,
    user: process_1.default.env.MEDLOG_DB_USER,
    password: process_1.default.env.MEDLOG_DB_PASSWORD
});
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});
exports.default = connection;
