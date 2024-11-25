const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const crypto = require("crypto");

// Middleware to check database connection
router.use((req, res, next) => {
  if (!req.db) {
    return res.status(500).json({ error: "Database connection not available" });
  }
  next();
});

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

// Create a new user
router.post("/api/users/signup", upload.none(), async (req, res) => {
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
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    // Check if email already exists
    const [existingUser] = await req.db.query(
      "SELECT * FROM study_users WHERE user_email = ?",
      [user_email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Generate backend-managed fields
    const user_account_number = Math.floor(100000 + Math.random() * 900000);
    const session_id = crypto.randomUUID();
    const user_cookie = crypto.randomBytes(16).toString("hex");
    const user_access_level = 2;

    // Insert user into database
    await req.db.query(
      `INSERT INTO study_users 
      (user_full_name, user_account_number, user_username, user_email, user_tele, user_contact_method, Age, Country, intended_use, education_status, education_level, favorite_subject, user_password, session_id, user_cookie, user_access_level) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    );

    res.json({
      success: true,
      message: "User successfully registered",
      user_account_number,
      session_id,
      profilePictureUrl,
    });
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

module.exports = router;
