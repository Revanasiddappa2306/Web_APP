const express = require("express");
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

const router = express.Router();
/////////////////////////////// role-page assignment route ////////////////////////////////////////
router.get('/role-page-assignments', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT PageID, RoleID FROM Alc_WebFramework.dbo.RolePageAssignments ");
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching role-page assignments:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

////////////////////////////////// role-page assignment remove route ////////////////////////////////////////
router.delete('/role-page-assignments/remove', async (req, res) => {
  const { PageID, RoleID } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('PageID', sql.VarChar, PageID)
      .input('RoleID', sql.VarChar, RoleID)
      .query('DELETE FROM Alc_WebFramework.dbo.RolePageAssignments WHERE PageID = @PageID AND RoleID = @RoleID');
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting role-page assignment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;