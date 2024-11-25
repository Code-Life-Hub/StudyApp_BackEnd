const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const upload = require("../utils/uploads");

// Middleware to check database connection
router.use((req, res, next) => {
  if (!req.db) {
    return res.status(500).json({ error: "Database connection not available" });
  }
  next();
});

// Get all users from study_users table
router.get("/users", async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM study_users");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Create a new user in study_users table, including profile picture upload
router.post("/signup", upload.single("profile_picture"), async (req, res) => {
  const {
    user_full_name,
    user_username,
    user_email,
    user_tele,
    user_contact_method,
    user_age,
    Country,
    intended_use,
    user_education_status,
    education_Level,
    favorite_subject,
    user_password,
  } = req.body;

  // Validate required fields
  if (
    !user_full_name ||
    !user_username ||
    !user_email ||
    !user_tele ||
    !user_contact_method ||
    !user_password
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // Handle profile picture (if uploaded)
  let profilePictureUrl = null;
  if (req.file) {
    profilePictureUrl = `https://studyapplication.nyc3.digitaloceanspaces.com/${req.file.key}`;
  }

  // Generate backend-managed fields
  const user_account_number = Math.floor(100000 + Math.random() * 900000);
  const session_id = crypto.randomUUID();
  const user_cookie = crypto.randomBytes(16).toString("hex");
  const user_pas_rst_tkn = null;
  const user_access_level = 2;

  try {
    // Insert user into database
    await req.db.query(
      "INSERT INTO study_users (user_full_name, user_account_number, user_username, user_email, user_tele, user_contact_method, user_age, Country, intended_use, user_education_status, education_Level, favorite_subject, user_password, profile_picture, session_id, user_cookie, user_pas_rst_tkn, user_access_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_full_name,
        user_account_number,
        user_username,
        user_email,
        user_tele,
        user_contact_method,
        user_age,
        Country,
        intended_use,
        user_education_status,
        education_Level,
        favorite_subject,
        user_password,
        profilePictureUrl,
        session_id,
        user_cookie,
        user_pas_rst_tkn,
        user_access_level,
      ]
    );

    // Respond with success and generated data
    res.json({
      success: true,
      message: "User successfully registered",
      user_account_number,
      session_id,
      profilePictureUrl,
    });
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Failed to insert user" });
  }
});

// Update profile picture for an existing user
router.post(
  "/upload-profile-picture",
  upload.single("profile_picture"), // Middleware to handle the upload
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const profilePictureUrl = `https://studyapplication.nyc3.digitaloceanspaces.com/${req.file.key}`;

    try {
      const { user_id } = req.body; // Assuming `user_id` is passed in the request
      if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Update the user's profile picture in the database
      await req.db.query(
        "UPDATE study_users SET profile_picture = ? WHERE user_id = ?",
        [profilePictureUrl, user_id]
      );

      res.json({
        success: true,
        message: "Profile picture uploaded successfully",
        profilePictureUrl,
      });
    } catch (err) {
      console.error("Error updating profile picture:", err);
      res.status(500).json({ error: "Failed to upload profile picture" });
    }
  }
);

module.exports = router;
