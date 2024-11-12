require("dotenv").config();
const mysql = require("mysql2");
const express = require("express");

const app = express();
const port = process.env.PORT || 25060;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 25060,
  ssl: {
    rejectUnauthorized: false, // This does not allow self-signed certs.
  },
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to DigitalOcean MySQL database");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
