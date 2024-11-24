const express = require("express");
const app = express();
const createConnection = require("./config/dbConfig");
const userRoutes = require("./routes/userRoutes"); // Correct import

app.use(express.json()); // Parse JSON body

// Establish the database connection
createConnection()
  .then((connection) => {
    app.locals.db = connection; // Store the connection for routes to use

    // Attach the database connection to the request
    app.use((req, res, next) => {
      req.db = connection; // Attach the DB connection
      next();
    });

    // Use userRoutes
    app.use("/api/users", userRoutes);

    // Start the server
    const port = 3001;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
