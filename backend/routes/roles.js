const express = require("express");
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

const router = express.Router();


router.post("/create-role", async (req, res) => {
  const { Name } = req.body;

  if (!Name) return res.status(400).json({ message: "Role name is required" });

  try {
    const pool = await poolPromise;

    const countResult = await pool
      .request()
      .query("SELECT COUNT(*) as count FROM Roles");

    const count = countResult.recordset[0].count + 1;
    const paddedCount = count.toString().padStart(2, "0");
    const newRoleID = `Ro${paddedCount}`;

    await pool
      .request()
      .input("RoleID", sql.VarChar(10), newRoleID)
      .input("Name", sql.VarChar(100), Name)
      .query("INSERT INTO Roles (RoleID, Name) VALUES (@RoleID, @Name)");

    res.status(201).json({ RoleID: newRoleID, Name });
  } catch (error) {
    console.error("❌ Failed to create role:", error);
    res.status(500).json({ message: "Error creating role" });
  }
});



module.exports = router;
