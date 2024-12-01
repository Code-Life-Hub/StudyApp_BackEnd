const mysql = require("mysql2/promise");

let pool;

function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: 25060,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10, // Maximum number of connections in the pool
      queueLimit: 0, // No limit for queued requests
      // connection timeout should be 20 minutes
      connectTimeout: 1200000,
    });
    console.log("Database pool created.");
  }

  // Log pool stats every 10 seconds
  // setInterval(async () => {
  //   try {
  //     const [rows] = await pool.query("SELECT 1");
  //     console.log("Pool is active and functional.");
  //   } catch (error) {
  //     console.error("Error testing pool connection:", {
  //       message: error.message,
  //       code: error.code,
  //       stack: error.stack,
  //     });
  //   }
  // }, 60000);

  return pool;
}

module.exports = createPool();
