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
router.get("/users", async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM study_users");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
  console.log(userRoutes);
});

// create a new user in study_users table.

const crypto = require("crypto");

router.post("/signup", async (req, res) => {
  const { user_full_name, user_username, user_email, user_tele, user_contact_method } = req.body;

  // Validate required user input fields
  if (!user_full_name || !user_username || !user_email || !user_tele || !user_contact_method) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // Generate backend-managed fields
  const user_account_number = Math.floor(100000 + Math.random() * 900000);
  const session_id = crypto.randomUUID();
  const user_cookie = crypto.randomBytes(16).toString("hex");
  const user_pas_rst_tkn = null;
  const user_access_level = 2;

  try {
    // Insert the user into the database
    await req.db.query(
      "INSERT INTO study_users (user_full_name, user_account_number, user_username, user_email, user_tele, user_contact_method, session_id, user_cookie, user_pas_rst_tkn, user_access_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_full_name,
        user_account_number,
        user_username,
        user_email,
        user_tele,
        user_contact_method,
        session_id,
        user_cookie,
        user_pas_rst_tkn,
        user_access_level,
      ]
    );

    // Respond with success and optionally return the generated fields
    res.json({
      success: true,
      message: "User successfully registered",
      user_account_number,
      session_id,
    });
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Failed to insert user" });
  }
});


module.exports = router;
