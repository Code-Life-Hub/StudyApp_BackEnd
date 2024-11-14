// Database configuration
const mysql = require("mysql2/promise");
require("dotenv").config();

async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: 25060,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    console.log("Connected to DigitalOcean MySQL database");
    return connection;
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
    throw err;
  }
}

module.exports = createConnection;
