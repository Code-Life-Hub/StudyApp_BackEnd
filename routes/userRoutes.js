const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Middleware to check database connection
router.use((req, res, next) => {
  if (!req.db) {
    console.error("Database connection is unavailable");
    return res.status(500).json({ error: "Database connection not available" });
  }
  next();
});

// Test Endpoint
// router.get("/test", (req, res) => {
//   res.status(200).json({ message: "Test route is working" });
// });

// Get all users
router.get("/api/users", async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM study_users");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/api/users/signup", async (req, res) => {
  const {
    user_full_name,
    user_username,
    user_email,
    user_tele,
    user_contact_method,
    Age,
    Country,
    intended_use,
    education_status,
    education_level,
    favorite_subject,
    user_password,
  } = req.body;

  console.log("Request Body:", req.body);

  if (
    !user_full_name ||
    !user_username ||
    !user_email ||
    !user_tele ||
    !user_contact_method ||
    !Age ||
    !Country ||
    !intended_use ||
    !education_status ||
    !education_level ||
    !user_password
  ) {
    console.error("Validation failed: Missing fields");
    return res.status(400).json({ error: "Invalid input" });
  }

  let connection;
  try {
    connection = await req.db;

    // Check if email already exists
    const [existingUser] = await connection.query(
      "SELECT * FROM study_users WHERE user_email = ?",
      [user_email]
    );

    if (existingUser.length > 0) {
      console.error("Duplicate email found:", user_email);
      return res.status(400).json({ error: "Email already exists" });
    }

    // Generate backend-managed fields
    const user_account_number = Math.floor(100000 + Math.random() * 900000);
    const session_id = crypto.randomUUID();
    const user_cookie = crypto.randomBytes(16).toString("hex");
    const user_access_level = 1;

    // Insert user into database
    const query = `
      INSERT INTO study_users 
      (user_full_name, user_account_number, user_username, user_email, user_tele, user_contact_method, Age, Country, intended_use, education_status, education_level, favorite_subject, user_password, session_id, user_cookie, user_access_level) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      user_full_name,
      user_account_number,
      user_username,
      user_email,
      user_tele,
      user_contact_method,
      Age,
      Country,
      intended_use,
      education_status,
      education_level,
      favorite_subject,
      user_password,
      session_id,
      user_cookie,
      user_access_level,
    ];

    await connection.query(query, params);

    res.json({
      success: true,
      message: "User successfully registered",
      user_account_number,
      session_id,
    });
  } catch (err) {
    console.error("Database error during user registration:", err);
    res.status(500).json({ error: "Failed to register user" });
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
  }
});

module.exports = router;
