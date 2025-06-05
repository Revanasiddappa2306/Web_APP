const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

const router = express.Router();

// User Registration Route//////////////////////////////////////////////////////////////////////////////////
router.post("/register-user", async (req, res) => {
  const { id, firstName, lastName, mobileNum, email, password } = req.body;

  if (!id || !firstName || !lastName || !mobileNum || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!email.endsWith("@alcon.com")) {
    return res.status(400).json({ message: "Email must be a valid @alcon.com address" });
  }

  try {
    const pool = await poolPromise;

    // Check if 521ID already exists
    const checkIdQuery = `SELECT * FROM Users WHERE UserID = @UserID`;
    const checkIdRequest = pool.request();
    checkIdRequest.input("UserID", sql.VarChar, id);
    const checkIdResult = await checkIdRequest.query(checkIdQuery);
    if (checkIdResult.recordset.length > 0) {
      return res.status(409).json({ message: "User already exists with this 521ID" });
    }

    // Check if email already exists
    const checkUserQuery = `SELECT * FROM Users WHERE Email = @Email`;
    const checkRequest = pool.request();
    checkRequest.input("Email", sql.NVarChar, email);
    const checkResult = await checkRequest.query(checkUserQuery);

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const insertQuery = `
      INSERT INTO Users (UserID, FirstName, LastName, MobileNum, Email, PasswordHash)
      VALUES (@UserID, @FirstName, @LastName, @MobileNum, @Email, @PasswordHash)
    `;

    const insertRequest = pool.request();
    insertRequest.input("UserID", sql.VarChar, id);
    insertRequest.input("FirstName", sql.NVarChar, firstName);
    insertRequest.input("LastName", sql.NVarChar, lastName);
    insertRequest.input("MobileNum", sql.NVarChar, mobileNum);
    insertRequest.input("Email", sql.NVarChar, email);
    insertRequest.input("PasswordHash", sql.NVarChar, hashedPassword);

    await insertRequest.query(insertQuery);

    res.status(201).json({ message: "User registered successfully ✌️" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

// Admin Registration Route ///////////////////////////////////////////////////////////////////////////////////////////
router.post("/register-admin", async (req, res) => {
  const { id, firstName, lastName, mobileNum, email, password } = req.body;

  if (!id || !firstName || !lastName || !mobileNum || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!email.endsWith("@alcon.com")) {
    return res.status(400).json({ message: "Email must be a valid @alcon.com address" });
  }

  try {
    const pool = await poolPromise;

    // Check if 521ID already exists
    const checkIdQuery = `SELECT * FROM Admins WHERE AdminID = @AdminID`;
    const checkIdRequest = pool.request();
    checkIdRequest.input("AdminID", sql.VarChar, id);
    const checkIdResult = await checkIdRequest.query(checkIdQuery);
    if (checkIdResult.recordset.length > 0) {
      return res.status(409).json({ message: "Admin already exists with this 521ID" });
    }

    // Check if email already exists
    const checkUserQuery = `SELECT * FROM Admins WHERE Email = @Email`;
    const checkRequest = pool.request();
    checkRequest.input("Email", sql.NVarChar, email);
    const checkResult = await checkRequest.query(checkUserQuery);

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ message: "Admin already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin
    const insertQuery = `
      INSERT INTO Admins (AdminID, FirstName, LastName, MobileNum, Email, PasswordHash)
      VALUES (@AdminID, @FirstName, @LastName, @MobileNum, @Email, @PasswordHash)
    `;

    const insertRequest = pool.request();
    insertRequest.input("AdminID", sql.VarChar, id);
    insertRequest.input("FirstName", sql.NVarChar, firstName);
    insertRequest.input("LastName", sql.NVarChar, lastName);
    insertRequest.input("MobileNum", sql.NVarChar, mobileNum);
    insertRequest.input("Email", sql.NVarChar, email);
    insertRequest.input("PasswordHash", sql.NVarChar, hashedPassword);

    await insertRequest.query(insertQuery);

    res.status(201).json({ message: "Admin registered successfully ✌️" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Error registering admin", error: err.message });
  }
});

// LOGIN USER //////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/user-login", async (req, res) => {
  const { userIdOrEmail, password } = req.body;

  if (!userIdOrEmail || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const pool = await poolPromise;

    const query = `
      SELECT * FROM Users 
      WHERE userID = @Input OR email = @Input
    `;
    const request = pool.request();
    request.input("Input", sql.VarChar, userIdOrEmail);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.recordset[0];

    // Log the user object to check what is returned
    console.log("Fetched user:", user);

    // Check if password_hash exists before comparing
    if (!user.PasswordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userID: user.UserID, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful 👍",
      token,
      user: {
        id: user.UserID,
        name: user.FirstName + " " + user.LastName,
        email: user.Email
      }
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    console.error(err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// LOGIN ADMIN ////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/admin-login", async (req, res) => {
  const { adminIdOrEmail, password } = req.body;

  if (!adminIdOrEmail || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const pool = await poolPromise;

    const query = `
      SELECT * FROM Admins 
      WHERE adminID = @Input OR email = @Input
    `;
    const request = pool.request();
    request.input("Input", sql.VarChar, adminIdOrEmail);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = result.recordset[0];

    // Log the user object to check what is returned
    console.log("Fetched admin:", admin);

    // Check if password_hash exists before comparing
    if (!admin.PasswordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.PasswordHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminID: admin.AdminID, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful 👍",
      token,
      admin: {
        id: admin.AdminID,
        name: admin.FirstName + " " + admin.LastName
      }
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    console.error(err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

module.exports = router;
