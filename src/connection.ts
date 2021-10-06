import mysql from 'mysql';
import process from 'process';

const connection = mysql.createConnection({
    host: process.env.MEDLOG_DB_HOST,
    port: process.env.MEDLOG_DB_PORT as unknown as number,
    database: process.env.MEDLOG_DB_NAME,
    user: process.env.MEDLOG_DB_USER,
    password: process.env.MEDLOG_DB_PASSWORD
})

connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

export default connection;