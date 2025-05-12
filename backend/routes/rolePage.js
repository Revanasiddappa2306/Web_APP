const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

const router = express.Router();
app.get('/api/role-page-assignments', async (req, res) => {
  try {
    const result = await pool.request().query("SELECT PageID, RoleID FROM Alc_WebFramework.dbo.RolePageAssignments ");
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching role-page assignments:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;