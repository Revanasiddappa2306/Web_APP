const express = require("express");
const router = express.Router();
const { poolPromise } = require("../config/db");

router.post("/submit", async (req, res) => {
  const { name, id, email, department, requirements } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request().query(`
      INSERT INTO Alc_WebFramework.dbo.Requirements (Name, [521ID], Email, Department, Requirements, CreatedAt)
      VALUES ('${name}', '${id}', '${email}', '${department}', '${requirements}', GETDATE())
    `);
    res.json({ message: "Requirement submitted!" });
  } catch (err) {
    console.error("Requirement submit error:", err);
    res.status(500).json({ message: "Failed to submit requirement" });
  }
});

// Fetch all requirements
router.get("/all", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * FROM Alc_WebFramework.dbo.Requirements WHERE IsDeleted = 0 ORDER BY CreatedAt DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Requirement fetch error:", err);
    res.status(500).json({ message: "Failed to fetch requirements" });
  }
});

router.post("/mark-read/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request().query(`
      UPDATE Alc_WebFramework.dbo.Requirements
      SET IsRead = 1
      WHERE RequirementID = ${id}
    `);
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

router.get("/unread-count", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT COUNT(*) AS count FROM Alc_WebFramework.dbo.Requirements WHERE IsRead = 0
    `);
    res.json({ count: result.recordset[0].count });
  } catch (err) {
    res.status(500).json({ message: "Failed to get unread count" });
  }
});

router.post("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request().query(`
      UPDATE Alc_WebFramework.dbo.Requirements
      SET Status = '${status}'
      WHERE RequirementID = ${id}
    `);
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

// Soft delete endpoint
router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request().query(`
      UPDATE Alc_WebFramework.dbo.Requirements
      SET IsDeleted = 1
      WHERE RequirementID = ${id}
    `);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete" });
  }
});

// Fetch deleted requests
router.get("/deleted", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * FROM Alc_WebFramework.dbo.Requirements WHERE IsDeleted = 1 ORDER BY CreatedAt DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deleted requirements" });
  }
});

module.exports = router;