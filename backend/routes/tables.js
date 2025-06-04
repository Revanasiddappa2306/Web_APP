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
    // Get the max PageID number
    const maxIdQuery = `
      SELECT MAX(CAST(SUBSTRING(PageID, 3, LEN(PageID)) AS INT)) AS maxId FROM Pages
    `;
    const maxIdResult = await pool.request().query(maxIdQuery);
    const maxId = maxIdResult.recordset[0].maxId || 0;
    const pageId = `Pg${(maxId + 1).toString().padStart(2, "0")}`; // Pg01, Pg02, etc.

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
    let primaryKeys = [];

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

      // Collect primary keys
      if (field.isPrimaryKey) {
        primaryKeys.push(safeColumnName);
      }
    });
    

    columns = columns.slice(0, -2); // Remove trailing comma & newline

    let primaryKeyClause = '';
    if (primaryKeys.length === 1) {
      primaryKeyClause = `PRIMARY KEY (${primaryKeys[0]})`;
    } else if (primaryKeys.length > 1) {
      primaryKeyClause = `PRIMARY KEY (${primaryKeys.join(", ")})`;
    } else {
      // Fallback to ID as primary key
      primaryKeyClause = `PRIMARY KEY (ID)`;
    }

    const createTableQuery = `
      CREATE TABLE ${dataTableName} (
        ID INT IDENTITY(1,1),
        ${columns},
        DateTimeEntered DATETIME,
        ${primaryKeyClause}
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

    // Get column types and primary keys
    const schemaQuery = `
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = @tableName
    `;
    const pkQuery = `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_NAME = @tableName AND OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + '.' + QUOTENAME(CONSTRAINT_NAME)), 'IsPrimaryKey') = 1
    `;
    const schemaResult = await pool.request()
      .input("tableName", sql.NVarChar, tableName)
      .query(schemaQuery);
    const pkResult = await pool.request()
      .input("tableName", sql.NVarChar, tableName)
      .query(pkQuery);

    const columnTypes = {};
    schemaResult.recordset.forEach(col => {
      columnTypes[col.COLUMN_NAME] = col.DATA_TYPE;
    });
    const primaryKeys = pkResult.recordset.map(row => row.COLUMN_NAME);

    const columns = Object.keys(data).map(col => `[${col}]`).join(", ");
    const parameters = Object.keys(data).map((col, idx) => `@param${idx}`).join(", ");

    const insertQuery = `INSERT INTO [${tableName}] (${columns}, DateTimeEntered) VALUES (${parameters}, GETDATE())`;

    const request = pool.request();
    Object.entries(data).forEach(([key, value], idx) => {
      const paramName = `param${idx}`;
      const colType = columnTypes[key];
      if (value === "" || value === undefined || value === null) {
        request.input(paramName, sql.Null);
      } else if (colType === "int" || colType === "float" || colType === "decimal" || colType === "numeric") {
        request.input(paramName, sql.Float, Number(value));
      } else if (colType === "bit") {
        request.input(paramName, sql.Bit, value === true || value === "true" || value === 1 ? 1 : 0);
      } else if (colType === "date" || colType === "datetime" || colType === "datetime2" || colType === "smalldatetime") {
        request.input(paramName, sql.DateTime, new Date(value));
      } else {
        request.input(paramName, sql.NVarChar, value);
      }
    });

    await request.query(insertQuery);
    return res.status(200).json({ status: "inserted", message: "✅ Data inserted successfully" });

  } catch (err) {
    // If primary key violation, do update instead
    if (err.number === 2627 || (err.originalError && err.originalError.code === 2627)) {
      // Build update query
      try {
        const pool = await poolPromise;
        const setClause = Object.keys(data)
          .filter(col => !primaryKeys.includes(col))
          .map((col, idx) => `[${col}] = @param${idx}`)
          .join(", ");
        const whereClause = primaryKeys.map((col, idx) => `[${col}] = @pk${idx}`).join(" AND ");
        const request = pool.request();

        let paramIdx = 0;
        Object.entries(data).forEach(([key, value]) => {
          if (!primaryKeys.includes(key)) {
            const colType = columnTypes[key];
            if (value === "" || value === undefined || value === null) {
              request.input(`param${paramIdx}`, sql.Null);
            } else if (colType === "int" || colType === "float" || colType === "decimal" || colType === "numeric") {
              request.input(`param${paramIdx}`, sql.Float, Number(value));
            } else if (colType === "bit") {
              request.input(`param${paramIdx}`, sql.Bit, value === true || value === "true" || value === 1 ? 1 : 0);
            } else if (colType === "date" || colType === "datetime" || colType === "datetime2" || colType === "smalldatetime") {
              request.input(`param${paramIdx}`, sql.DateTime, new Date(value));
            } else {
              request.input(`param${paramIdx}`, sql.NVarChar, value);
            }
            paramIdx++;
          }
        });
        // Add primary key params for WHERE clause
        primaryKeys.forEach((col, idx) => {
          const colType = columnTypes[col];
          const value = data[col];
          if (value === "" || value === undefined || value === null) {
            request.input(`pk${idx}`, sql.Null);
          } else if (colType === "int" || colType === "float" || colType === "decimal" || colType === "numeric") {
            request.input(`pk${idx}`, sql.Float, Number(value));
          } else if (colType === "bit") {
            request.input(`pk${idx}`, sql.Bit, value === true || value === "true" || value === 1 ? 1 : 0);
          } else if (colType === "date" || colType === "datetime" || colType === "datetime2" || colType === "smalldatetime") {
            request.input(`pk${idx}`, sql.DateTime, new Date(value));
          } else {
            request.input(`pk${idx}`, sql.NVarChar, value);
          }
        });

        await request.query(`UPDATE [${tableName}] SET ${setClause} WHERE ${whereClause}`);
        return res.status(200).json({ status: "updated", message: "Row updated as primary key already existed." });
      } catch (updateErr) {
        return res.status(500).json({ code: "UPSERT_UPDATE_FAILED", message: updateErr.message });
      }
    }

    // Other errors
    if (err.number === 257 || (err.originalError && err.originalError.code === 257)) {
      return res.status(400).json({ code: "TYPE_CONVERSION_ERROR", message: "Invalid data type for one or more fields." });
    }
    if (err.message && err.message.includes("cannot be null")) {
      return res.status(400).json({ code: "NOT_NULL_VIOLATION", message: "A required field is missing." });
    }
    return res.status(500).json({ code: "UNKNOWN_ERROR", message: err.message || "Unknown error" });
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

    // Get column types from INFORMATION_SCHEMA
    const schemaQuery = `
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = @tableName
    `;
    const schemaResult = await pool.request()
      .input("tableName", sql.NVarChar, tableName)
      .query(schemaQuery);

    const columnTypes = {};
    schemaResult.recordset.forEach(col => {
      columnTypes[col.COLUMN_NAME] = col.DATA_TYPE;
    });

    const setClause = Object.keys(data)
      .map((col, idx) => `[${col}] = @param${idx}`)
      .join(", ");
    const request = pool.request();

    Object.entries(data).forEach(([key, value], idx) => {
      const paramName = `param${idx}`;
      const colType = columnTypes[key];

      // Insert null if value is empty string or undefined or null
      if (value === "" || value === undefined || value === null) {
        request.input(paramName, sql.Null);
      } else if (colType === "int" || colType === "float" || colType === "decimal" || colType === "numeric") {
        request.input(paramName, sql.Float, Number(value));
      } else if (colType === "bit") {
        request.input(paramName, sql.Bit, value === true || value === "true" || value === 1 ? 1 : 0);
      } else if (colType === "date" || colType === "datetime" || colType === "datetime2" || colType === "smalldatetime") {
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