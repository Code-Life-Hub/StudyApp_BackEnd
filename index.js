const express = require("express");
const app = express();
const createConnection = require("./config/dbConfig");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

// Middleware to parse JSON body
app.use(express.json());

// Connect to the database
createConnection()
  .then((connection) => {
    app.locals.db = connection; // Store the connection in app locals

    // Attach the database connection to the request object
    app.use((req, res, next) => {
      req.db = connection; // Attach the DB connection to the request
      next();
    });

    // Mount userRoutes with a base URL
    app.use("/api/users", userRoutes);

    // Fallback route for undefined endpoints
    app.use((req, res) => {
      res.status(404).json({ error: "Route not found" });
    });

    // Start the server
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1); // Exit the process if the DB connection fails
  });
