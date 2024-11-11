require("dotenv").config();
const mysql = require("mysql2");
const fs = require("fs").promises; // Use promises for async/await
const path = require("path");

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

// Function to import the SQL file
async function importSQLFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");

    await new Promise((resolve, reject) => {
      connection.query(data, (queryErr, results) => {
        if (queryErr) {
          console.error("Error executing SQL commands:", queryErr);
          reject(queryErr);
        } else {
          console.log("Database import successful:", results);
          resolve();
        }
      });
    });
  } catch (err) {
    console.error("Error reading or executing SQL file:", err);
  } finally {
    // Close the connection when done
    connection.end();
  }
}

// Call the function to import the SQL file
const sqlFilePath = path.join(__dirname, "studyapp_backup.sql");
importSQLFile(sqlFilePath);
