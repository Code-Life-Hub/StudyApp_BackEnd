const express = require("express");
const app = express();
const mysql = require("mysql2");

require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 25060,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(express.json());

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to DigitalOcean MySQL database");
});

// Start the server
const port = process.env.PORT || 25060;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
