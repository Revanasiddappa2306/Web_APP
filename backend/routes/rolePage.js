const express = require("express");
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

const router = express.Router();
/////////////////////////////// role-page assignment route ////////////////////////////////////////
// router.get('/role-page-assignments', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query("SELECT PageID, RoleID FROM Alc_WebFramework.dbo.RolePageAssignments ");
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('Error fetching role-page assignments:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

router.get("/role-page-assignments", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        rpa.PageID, 
        p.PageName, 
        rpa.RoleID, 
        r.Name
      FROM Alc_WebFramework.dbo.RolePageAssignments rpa
      JOIN Alc_WebFramework.dbo.Pages p ON rpa.PageID = p.PageID
      JOIN Alc_WebFramework.dbo.Roles r ON rpa.RoleID = r.RoleID
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching role-page assignments:", error);
    res.status(500).json({ message: "Failed to fetch assignments" });
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