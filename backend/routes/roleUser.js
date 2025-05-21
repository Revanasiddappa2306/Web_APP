const express = require("express");
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

const router = express.Router();

////////////////////////////// role-page assignment route ////////////////////////////////////////
// router.get('/user-role-assignments', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query("SELECT UserID, RoleID FROM Alc_WebFramework.dbo.UserRoleAssignments");
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('Error fetching role-page assignments:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// Example for Express + mssql
router.get("/user-role-assignments", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        ura.UserID, 
        (u.FirstName + ' ' + u.LastName) AS UserName,
        ura.RoleID, 
        r.Name 
      FROM Alc_WebFramework.dbo.UserRoleAssignments ura
      JOIN Alc_WebFramework.dbo.Users u ON ura.UserID = u.UserID
      JOIN Alc_WebFramework.dbo.Roles r ON ura.RoleID = r.RoleID
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching user-role assignments:", error);
    res.status(500).json({ message: "Failed to fetch user-role assignments" });
  }
});

////////////////////////////////// role-page assignment remove route ////////////////////////////////////////
router.delete('/user-role-assignments/remove', async (req, res) => {
  const { UserID, RoleID } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('UserID', sql.VarChar, UserID)
      .input('RoleID', sql.VarChar, RoleID)
      .query('DELETE FROM Alc_WebFramework.dbo.UserRoleAssignments WHERE UserID = @UserID AND RoleID = @RoleID');
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting user-role assignment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;