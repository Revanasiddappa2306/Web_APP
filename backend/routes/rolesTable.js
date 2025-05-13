const express = require("express");
const { poolPromise, sql } = require("../config/db");
require("dotenv").config();

const router = express.Router();

////////////////////////////////// get roles route ////////////////////////////////////////////////////////
router.get("/get-roles", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT RoleID, Name FROM Alc_WebFramework.dbo.Roles");
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error fetching roles:", err);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
});
////////////////////////////////// create role route ////////////////////////////////////////////////////////
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

//////////////////////////// delete role route ////////////////////////////////////////////////////////
router.delete("/delete-role/:RoleID", async (req, res) => {
  const { RoleID } = req.params;

  if (!RoleID) {
    return res.status(400).json({ message: "RoleID is required" });
  }

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("RoleID", sql.VarChar(10), RoleID)
      .query("DELETE FROM Roles WHERE RoleID = @RoleID");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("❌ Failed to delete role:", error);
    res.status(500).json({ message: "Error deleting role" });
  }
});



module.exports = router;
