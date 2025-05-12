const express = require("express");
const cors = require("cors");
const { poolPromise, sql } = require("./config/db");

const app = express();
const PORT = 5000;


app.use(cors());

app.get("/api/test", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Users");
        res.json(result.recordset);
    } catch (err) {
        console.error("❌ Query Failed!", err);
        res.status(500).send("Server Error");
    }
});

//middleware
app.use(express.json()); // 🔴 Fix: Allows JSON body parsing
app.use("/api/auth", require("./routes/auth")); // For users
app.use("/api/pages", require("./routes/pageRoutes")); // Page routes
app.use("/api/tables", require("./routes/tables")); // Table routes
app.use("/api/roles", require("./routes/rolesTable")); // Role routes
app.use("/api/pageTable", require("./routes/pageTable")); // Page table routes
app.use("/api/userTable", require("./routes/userTable")); // User table routes
app.use("/api/rolePage", require("./routes/rolePage")); // Role page routes

// start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
