// routes/userRoutes.js
const express = require("express");
const router = express.Router();

// Middleware
router.use((req, res, next) => {
  if (!req.db) {
    return res.status(500).json({ error: "Database connection not available" });
  }
  next();
});

// all users in study_users table.
router.get("/", async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM study_users");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
