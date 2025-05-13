const db = require("../database"); // ייבוא חיבור למסד הנתונים

// Middleware לשליפת כל הקורסים
async function getUsers(req, res, next) {
  try {
    const [rows] = await db.query(`
      SELECT users.id, users.name, users.userName, users.email, userlavel.name AS roleName
      FROM users
      JOIN userlavel ON users.typeID = userlavel.id
    `);
    req.users = rows;
    next();
  } catch (err) {
    req.error = { status: 500, message: "Error fetching users" };
    next(err);
  }
}

// Middleware ליצירת קורס חדש
async function addUser(req, res, next) {
  const { name, email, rool, userName, pass } = req.body;

  if (!name || !rool || !userName || !pass || !email) {
    req.error = { status: 400, message: "Missing required fields" };
    return next();
  }

  try {
    // שליפת typeID לפי שם התפקיד
    const [rows] = await db.query("SELECT id FROM userlavel WHERE name = ?", [rool]);
    if (rows.length === 0) {
      req.error = { status: 400, message: "Invalid role type" };
      return next();
    }

    const typeID = rows[0].id;

    const [result] = await db.query(
      "INSERT INTO users (name, typeID, userName, pass, email) VALUES (?, ?, ?, ?, ?)",
      [name, typeID, userName, pass, email]
    );

    req.newUser = { id: result.insertId, name };
    next();
  } catch (err) {
    req.error = { status: 500, message: "Error creating user" };
    next(err);
  }
}

// Middleware לעדכון קורס קיים
async function updateUser(req, res, next) {
  const id = req.params.id;
  const { name, email, rool, userName, pass } = req.body;

  if (!id || !name || !email || !userName || !pass || !rool) {
    req.error = { status: 400, message: "Missing required fields" };
    return next();
  }

  try {
    // שליפת typeID מחדש לפי rool
    const [rows] = await db.query("SELECT id FROM userlavel WHERE name = ?", [rool]);
    if (rows.length === 0) {
      req.error = { status: 400, message: "Invalid role type" };
      return next();
    }

    const typeID = rows[0].id;

    const [result] = await db.query(
      `UPDATE users SET name = ?, email = ?, userName = ?, pass = ?, typeID = ? WHERE id = ?`,
      [name, email, userName, pass, typeID, id]
    );

    if (result.affectedRows === 0) {
      req.error = { status: 404, message: "User not found" };
      return next();
    }

    req.updatedUser = { id, name };
    next();
  } catch (err) {
    req.error = { status: 500, message: "Error updating user" };
    next(err);
  }
}

// Middleware למחיקת קורס
async function deleteUser(req, res, next) {
  const id = req.body.id;

  if (!id) {
    req.error = { status: 400, message: "Missing user id" };
    return next();
  }

  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      req.error = { status: 404, message: "User not found" };
      return next();
    }

    req.deletedMessage = { message: "User deleted successfully" };
    next();
  } catch (err) {
    req.error = { status: 500, message: "Error deleting user" };
    next(err);
  }
}

// Middleware לשליפת משתמש לפי מזהה
async function getUserById(req, res, next) {
  const id = req.params.id;
  try {
    const [rows] = await db.query(`
      SELECT users.*, userlavel.name AS roleName
      FROM users
      JOIN userlavel ON users.typeID = userlavel.id
      WHERE users.id = ?
    `, [id]);

    if (rows.length === 0) {
      req.error = { status: 404, message: "User not found" };
      return next();
    }

    req.user = rows[0];
    next();
  } catch (err) {
    req.error = { status: 500, message: "Error fetching user" };
    next(err);
  }
}

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getUserById,
};
