const express = require("express");
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

const router = express.Router();

router.get('/user-role-assignments', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT UserID, RoleID FROM Alc_WebFramework.dbo.UserRoleAssignments");
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching role-page assignments:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;