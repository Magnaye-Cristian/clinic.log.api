"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var promise_1 = __importDefault(require("mysql2/promise"));
var process_1 = __importDefault(require("process"));
var connection = promise_1.default.createConnection({
    host: process_1.default.env.MEDLOG_DB_HOST,
    port: process_1.default.env.MEDLOG_DB_PORT,
    database: process_1.default.env.MEDLOG_DB_NAME,
    user: process_1.default.env.MEDLOG_DB_USER,
    password: process_1.default.env.MEDLOG_DB_PASSWORD
});
// connection.((err) => {
//     console.log(process.env.MEDLOG_DB_HOST)
//     console.log(process.env.MEDLOG_DB_PORT)
//     console.log(process.env.MEDLOG_DB_NAME)
//     console.log(process.env.MEDLOG_DB_USER)
//     console.log(process.env.MEDLOG_DB_PASSWORD)
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//     console.log('connected as id ' + connection.threadId);
// });
exports.default = connection;
