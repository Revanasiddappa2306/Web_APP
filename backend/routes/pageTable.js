const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

// GET all pages
router.get("/get-pages", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT PageID, PageName, CreatedByAdminID FROM Alc_WebFramework.dbo.Pages");
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching pages:", error);
    res.status(500).json({ message: "Failed to fetch pages" });
  }
});

module.exports = router;
