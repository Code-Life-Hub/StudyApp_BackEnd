const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2/promise");
require("dotenv").config();

// -- MySQL Database Connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 25060,
  ssl: {
    rejectUnauthorized: false,
  },
});

// -- Query DB w/error handling
async function queryDatabase(query, params = []) {
  try {
    const [rows] = await db.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Database query failed:", error);
    throw error;
  }
}

// -- Gen. Sesh ID
function generateSessionId() {
  return uuidv4();
}

// -- Assign cookies
function setSessionCookie(res, sessionId) {
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: "Lax",
  });
}

// -- Verify SessionID
function validateSession(req) {
  return req.cookies && req.cookies.sessionId;
}

// -- Clear session cookie on logout
function clearSessionCookie(res) {
  res.clearCookie("sessionId", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
}

//|---------------------------------------------CRUD OPS START HERE---------------------------------------------|
// -- Insert a new user
async function createUser(user) {
  const query = `INSERT INTO study_users (user_full_name, user_account_number, user_username, user_email, user_tele, user_contact_method, Age, Country, intended_use, education_status, education_level, favorite_subject, user_password, profile_picture) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  const params = [
    user.user_full_name,
    user.user_username,
    user.user_email,
    user.user_tele,
    user.user_contact_method,
    user.Age,
    user.Country,
    user.intended_use,
    user.education_status,
    user.education_level,
    user.favorite_subject,
    user.user_password,
    user.profile_picture,
  ];
  return await queryDatabase(query, params);
}

// -- Get user by session ID
async function getUserBySessionId(sessionId) {
  const query = `
    SELECT * FROM study_users WHERE session_id = ?
    `;
  const params = [sessionId];
  return await queryDatabase(query, params);
}

// -- Update user's last activity
async function updateUserLastActivity(username, lastActivity) {
  const query = `
    UPDATE study_users SET user_last_activity = ? WHERE user_username = ?
  `;
  const params = [lastActivity, username];
  return await queryDatabase(query, params);
}

// -- Delete user by username
async function deleteUserByUsername(username) {
  const query = `
    DELETE FROM study_users WHERE user_username = ?
  `;
  const params = [username];
  return await queryDatabase(query, params);
}
//|---------------------------------------------CRUD OPS END HERE---------------------------------------------|

module.exports = {
  generateSessionId,
  setSessionCookie,
  validateSession,
  clearSessionCookie,
  createUser,
  getUserBySessionId,
  updateUserLastActivity,
  deleteUserByUsername,
};
