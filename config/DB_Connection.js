const mysql = require("mysql2/promise");
const dotenv = require("dotenv").config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.CONNECTIONLIMIT,
});

module.exports = pool;
