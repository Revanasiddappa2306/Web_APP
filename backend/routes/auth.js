const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

const router = express.Router();

// Save Page Details Route
router.post("/save-page-details", async (req, res) => {
  const { PageName, StoragePath, CreatedByAdminID } = req.body;

  if (!PageName || !StoragePath || !CreatedByAdminID) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const pool = await poolPromise;

    // Generate new PageID (example: Pg01, Pg02)
    const countQuery = `SELECT COUNT(*) AS count FROM Pages`;
    const countResult = await pool.request().query(countQuery);
    const pageCount = countResult.recordset[0].count + 1;
    const pageId = `Pg${pageCount.toString().padStart(2, "0")}`; // Pg01, Pg02, etc.

    // Insert into Pages table
    const insertQuery = `
      INSERT INTO Pages (PageID, PageName, StoragePath, CreatedByAdminID)
      VALUES (@PageID, @PageName, @StoragePath, @CreatedByAdminID)
    `;

    const insertRequest = pool.request();
    insertRequest.input("PageID", sql.VarChar, pageId);
    insertRequest.input("PageName", sql.NVarChar, PageName);
    insertRequest.input("StoragePath", sql.NVarChar, StoragePath);
    insertRequest.input("CreatedByAdminID", sql.VarChar, CreatedByAdminID);

    await insertRequest.query(insertQuery);

    res.status(201).json({ message: "Page details saved successfully", PageID: pageId });
  } catch (err) {
    console.error("❌ Page Details Save Error:", err);
    res.status(500).json({ message: "Error saving page details", error: err.message });
  }
});


router.post("/create-data-table", async (req, res) => {
  const { pageName, pageId, fieldConfigs } = req.body;

  if (!pageName || !pageId || !fieldConfigs) {
    return res.status(400).json({ message: "PageName, PageID, and fieldConfigs are required" });
  }

  try {
    const pool = await poolPromise;

    const dataTableName = `${pageName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")}_Table`;

    let columns = '';
    Object.entries(fieldConfigs).forEach(([key, field], index) => {
      const safeColumnName = field.label
        ? field.label.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
        : `Field${index + 1}`;
      
      columns += `${safeColumnName} NVARCHAR(255),\n`;
    });

    columns = columns.slice(0, -2); // Remove trailing comma & newline

    const createTableQuery = `
      CREATE TABLE ${dataTableName} (
        ID INT PRIMARY KEY IDENTITY(1,1),
        ${columns},
        DateTimeEntered DATETIME
      );
    `;

    await pool.request().query(createTableQuery);

    const insertQuery = `
      INSERT INTO PageDataTables (PageID, DataTableName)
      VALUES (@PageID, @DataTableName)
    `;

    const insertRequest = pool.request();
    insertRequest.input("PageID", sql.VarChar, pageId);
    insertRequest.input("DataTableName", sql.VarChar, dataTableName);

    await insertRequest.query(insertQuery);

    res.status(201).json({ message: "Data table created successfully", dataTableName });
  } catch (err) {
    console.error("❌ Error creating data table:", err);
    res.status(500).json({ message: "Error creating data table", error: err.message });
  }
});




// User Registration Route
router.post("/register-user", async (req, res) => {
  const { firstName, lastName, mobileNum, email, password } = req.body;

  if (!firstName || !lastName || !mobileNum || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const pool = await poolPromise;

    // Check if email already exists
    const checkUserQuery = `SELECT * FROM Users WHERE Email = @Email`;
    const checkRequest = pool.request();
    checkRequest.input("Email", sql.NVarChar, email);
    const checkResult = await checkRequest.query(checkUserQuery);

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    // Generate new UserID (example: Us01, Us02)
    const getUserCountQuery = `SELECT COUNT(*) AS count FROM Users`;
    const countResult = await pool.request().query(getUserCountQuery);
    const userCount = countResult.recordset[0].count + 1;
    const userId = `Us${userCount.toString().padStart(2, "0")}`; // Us01, Us02, etc.

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const insertQuery = `
      INSERT INTO Users (UserID, FirstName, LastName, MobileNum, Email, PasswordHash)
      VALUES (@UserID, @FirstName, @LastName, @MobileNum, @Email, @PasswordHash)
    `;

    const insertRequest = pool.request();
    insertRequest.input("UserID", sql.VarChar, userId);
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


// Admin Registration Route
router.post("/register-admin", async (req, res) => {
  const { firstName, lastName, mobileNum, email, password } = req.body;

  if (!firstName || !lastName || !mobileNum || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const pool = await poolPromise;

    // Check if email already exists
    const checkUserQuery = `SELECT * FROM Admins WHERE Email = @Email`;
    const checkRequest = pool.request();
    checkRequest.input("Email", sql.NVarChar, email);
    const checkResult = await checkRequest.query(checkUserQuery);

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ message: "Admin already exists with this email" });
    }

    // Generate new UserID (example: Us01, Us02)
    const getUserCountQuery = `SELECT COUNT(*) AS count FROM Admins`;
    const countResult = await pool.request().query(getUserCountQuery);
    const adminCount = countResult.recordset[0].count + 1;
    const adminId = `Ad${adminCount.toString().padStart(2, "0")}`; // Us01, Us02, etc.

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const insertQuery = `
      INSERT INTO Admins (AdminID, FirstName, LastName, MobileNum, Email, PasswordHash)
      VALUES (@AdminID, @FirstName, @LastName, @MobileNum, @Email, @PasswordHash)
    `;

    const insertRequest = pool.request();
    insertRequest.input("AdminID", sql.VarChar, adminId);
    insertRequest.input("FirstName", sql.NVarChar, firstName);
    insertRequest.input("LastName", sql.NVarChar, lastName);
    insertRequest.input("MobileNum", sql.NVarChar, mobileNum);
    insertRequest.input("Email", sql.NVarChar, email);
    insertRequest.input("PasswordHash", sql.NVarChar, hashedPassword);

    await insertRequest.query(insertQuery);

    res.status(201).json({ message: "Admin registered successfully ✌️" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});


// LOGIN USER
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

    res.json({ message: "Login successful 👍", token });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    console.error(err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});



// LOGIN ADMIN
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

    res.json({ message: "Login successful 👍", token });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    console.error(err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});


// ///// Insert Data into Table Route
// router.post("/insert-into-table", async (req, res) => {
//   const { tableName, data } = req.body;

//   if (!tableName || !data || typeof data !== 'object') {
//     return res.status(400).json({ message: "Table name and data object are required" });
//   }

//   try {
//     const pool = await poolPromise;

//     const columns = Object.keys(data).map(col => `[${col}]`).join(", ");
//     const values = Object.values(data).map(val => `'${val}'`).join(", ");

//     const insertQuery = `INSERT INTO ${tableName} (${columns}, DateTimeEntered) VALUES (${values}, GETDATE())`;

//     await pool.request().query(insertQuery);

//     res.status(200).json({ message: "Data inserted successfully" });
//   } catch (err) {
//     console.error("❌ Error inserting data:", err);
//     res.status(500).json({ message: "Error inserting data", error: err.message });
//   }
// });

router.post("/insert-into-table", async (req, res) => {
  const { tableName, data } = req.body;

  if (!tableName || !data || typeof data !== 'object') {
    return res.status(400).json({ message: "Table name and data object are required" });
  }

  try {
    const pool = await poolPromise;

    // Prepare column names and parameterized placeholders
    const columns = Object.keys(data).map(col => `[${col}]`).join(", ");
    const parameters = Object.keys(data).map((col, idx) => `@param${idx}`).join(", ");

    // Start query with parameterized values
    const insertQuery = `INSERT INTO [${tableName}] (${columns}, DateTimeEntered) VALUES (${parameters}, GETDATE())`;

    const request = pool.request();
    Object.values(data).forEach((val, idx) => {
      request.input(`param${idx}`, val);
    });

    await request.query(insertQuery);

    res.status(200).json({ message: "✅ Data inserted successfully" });
  } catch (err) {
    console.error("❌ Error inserting data:", err);
    res.status(500).json({ message: "Error inserting data", error: err.message });
  }
});



module.exports = router;
