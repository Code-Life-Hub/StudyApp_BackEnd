// routes/userRoutes.js
const express = require("express");
const router = express.Router();

// Example route
router.get("/", async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM study_users"); // Assumes you have a query like this
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
