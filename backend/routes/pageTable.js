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


//////////////////////// role page assignment route ////////////////////////////////////////
router.post('/assign-pages-to-roles', async (req, res) => {
  const { pageIDs, roleIDs } = req.body;

  if (!Array.isArray(pageIDs) || !Array.isArray(roleIDs)) {
    return res.status(400).json({ error: "pageIDs and roleIDs must be arrays" });
  }

  try {
    const pool = await poolPromise;
    // const poolConn = await pool.connect();
    const request = pool.request();

    for (const roleID of roleIDs) {
      for (const pageID of pageIDs) {
        await request.query(`
          IF NOT EXISTS (
            SELECT 1 FROM Alc_WebFramework.dbo.RolePageAssignments
            WHERE RoleID = '${roleID}' AND PageID = '${pageID}'
          )
          BEGIN
            INSERT INTO Alc_WebFramework.dbo.RolePageAssignments (RoleID, PageID)
            VALUES ('${roleID}', '${pageID}')
          END
        `);
      }
    }

    res.status(200).json({ message: "Pages assigned to roles successfully" });
  } catch (err) {
    console.error("Assignment error:", err);
    res.status(500).json({ error: "Assignment failed" });
  }
});


module.exports = router;
