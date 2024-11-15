const express = require("express");
const app = express();
const createConnection = require("./config/dbConfig");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

// Establish the database connection
createConnection()
  .then((connection) => {
    app.locals.db = connection;

    // Use routes
    app.use(
      "/api/users",
      (req, res, next) => {
        req.db = connection;
        next();
      },
      userRoutes
    );

    // Start the server after successful database connection
    const port = process.env.PORT || 25060;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
