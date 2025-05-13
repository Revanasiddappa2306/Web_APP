const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

// GET all pages
router.get("/get-users", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT UserID, FirstName,LastName, MobileNum FROM Alc_WebFramework.dbo.Users");
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching pages:", error);
    res.status(500).json({ message: "Failed to fetch Users" });
  }
});

///////////////// user role assignment route ////////////////////////////////////////
router.post('/assign-users-to-roles', async (req, res) => {
  const { userIDs, roleIDs } = req.body;

  if (!Array.isArray(userIDs) || !Array.isArray(roleIDs)) {
    return res.status(400).json({ error: "userIDs and roleIDs must be arrays" });
  }

  try {
    const pool = await poolPromise;

    for (const userID of userIDs) {
      for (const roleID of roleIDs) {
        await pool.request()
          .input('UserID', userID)
          .input('RoleID', roleID)
          .query(`
            IF NOT EXISTS (
              SELECT 1 FROM Alc_WebFramework.dbo.UserRoleAssignments 
              WHERE UserID = @UserID AND RoleID = @RoleID
            )
            INSERT INTO Alc_WebFramework.dbo.UserRoleAssignments (UserID, RoleID)
            VALUES (@UserID, @RoleID)
          `);
      }
    }

    res.json({ message: "Users successfully assigned to roles." });
  } catch (err) {
    console.error("Error assigning users to roles:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
