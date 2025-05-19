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

// Create Data Table Route//////////////////////////////////////////////////////////////////

router.post("/create-data-table", async (req, res) => {
  const { pageName, pageId, fieldConfigs } = req.body;

  if (!pageName || !pageId || !fieldConfigs) {
    return res.status(400).json({ message: "PageName, PageID, and fieldConfigs are required" });
  }

  try {
    const pool = await poolPromise;

    const dataTableName = `${pageName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")}_Table`;

    let columns = '';

    const typeMap = {
      DatePicker: "Date",
      NumberInput: "Number",
      TextField: "Text",
      Checkbox: "Checkbox",
      Dropdown: "Dropdown"
    };

    Object.entries(fieldConfigs).forEach(([key, field], index) => {
      const safeColumnName = field.label
        ? field.label.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
        : `Field${index + 1}`;

      // Map frontend type to backend type
      const rawType = field.type || key.split("-")[0];
      const type = typeMap[rawType] || rawType;

      let columnType = "NVARCHAR(255)"; // default
      switch (type) {
        case "Number":
          columnType = "FLOAT";
          break;
        case "Date":
          columnType = "DATE";
          break;
        case "Checkbox":
          columnType = "BIT";
          break;
        case "Dropdown":
        case "Text":
        default:
          columnType = "NVARCHAR(255)";
          break;
      }

      columns += `${safeColumnName} ${columnType},\n`;
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


////////////////////////// insert into table route ///////////////////////
router.post("/insert-into-table", async (req, res) => {
  const { tableName, data } = req.body;

  if (!tableName || !data || typeof data !== 'object') {
    return res.status(400).json({ message: "Table name and data object are required" });
  }

  try {
    const pool = await poolPromise;

    const columns = Object.keys(data).map(col => `[${col}]`).join(", ");
    const parameters = Object.keys(data).map((col, idx) => `@param${idx}`).join(", ");

    const insertQuery = `INSERT INTO [${tableName}] (${columns}, DateTimeEntered) VALUES (${parameters}, GETDATE())`;

    const request = pool.request();

    Object.entries(data).forEach(([key, value], idx) => {
      const paramName = `param${idx}`;

      if (typeof value === "number") {
        request.input(paramName, sql.Int, value);
      } else if (!isNaN(Date.parse(value))) {
        // Valid date string
        request.input(paramName, sql.DateTime, new Date(value));
      } else {
        request.input(paramName, sql.NVarChar, value);
      }
    });

    await request.query(insertQuery);

    res.status(200).json({ message: "✅ Data inserted successfully" });
  } catch (err) {
    console.error("❌ Error inserting data:", err);
    res.status(500).json({ message: "Error inserting data", error: err.message });
  }
});

// Get all rows from a table //////////////////////////////////////////////////////////
router.post("/get-table-data", async (req, res) => {
  const { tableName } = req.body;
  if (!tableName) {
    return res.status(400).json({ message: "Table name is required" });
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT * FROM [${tableName}] ORDER BY ID DESC`);
    res.json({ rows: result.recordset });
  } catch (err) {
    console.error("❌ Error fetching table data:", err);
    res.status(500).json({ message: "Error fetching table data", error: err.message });
  }
});

// Update a row by ID //////////////////////////////////////////////////////////////////////////////
router.post("/update-row", async (req, res) => {
  const { tableName, id, data } = req.body;
  if (!tableName || !id || !data || typeof data !== "object") {
    return res.status(400).json({ message: "Table name, id, and data are required" });
  }
  try {
    const pool = await poolPromise;
    const setClause = Object.keys(data)
      .map((col, idx) => `[${col}] = @param${idx}`)
      .join(", ");
    const request = pool.request();
    Object.entries(data).forEach(([key, value], idx) => {
      const paramName = `param${idx}`;
      if (typeof value === "number") {
        request.input(paramName, sql.Int, value);
      } else if (!isNaN(Date.parse(value))) {
        request.input(paramName, sql.DateTime, new Date(value));
      } else {
        request.input(paramName, sql.NVarChar, value);
      }
    });
    request.input("id", sql.Int, id);
    await request.query(`UPDATE [${tableName}] SET ${setClause} WHERE ID = @id`);
    res.json({ message: "Row updated successfully" });
  } catch (err) {
    console.error("❌ Error updating row:", err);
    res.status(500).json({ message: "Error updating row", error: err.message });
  }
});

// Delete rows by IDs ////////////////////////////////////////////////////////////
router.post("/delete-rows", async (req, res) => {
  const { tableName, ids } = req.body;
  if (!tableName || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Table name and ids array are required" });
  }
  try {
    const pool = await poolPromise;
    const idParams = ids.map((_, i) => `@id${i}`).join(", ");
    const request = pool.request();
    ids.forEach((id, i) => {
      request.input(`id${i}`, sql.Int, id);
    });
    await request.query(`DELETE FROM [${tableName}] WHERE ID IN (${idParams})`);
    res.json({ message: "Rows deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting rows:", err);
    res.status(500).json({ message: "Error deleting rows", error: err.message });
  }
});

module.exports = router;