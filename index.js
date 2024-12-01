const express = require("express");
const app = express();
const pool = require("./config/dbConfig"); // Use the connection pool
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const cors = require("cors");

// Configure CORS
app.use(
  cors({
    origin: ["https://study-buddy-ewbor.ondigitalocean.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware to parse JSON body
app.use(express.json());

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Attach a database connection to each request
app.use(async (req, res, next) => {
  try {
    req.db = await pool.getConnection(); // Get a connection from the pool
    next();
  } catch (err) {
    console.error("Failed to get a database connection:", err);
    res.status(500).json({ error: "Database connection error" });
  }
});

// Mount user routes
app.use("/api/users", userRoutes);

// Release the database connection after each request
app.use((req, res, next) => {
  if (req.db) req.db.release(); // Release the connection back to the pool
  next();
});

// Fallback route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
