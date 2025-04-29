const { sql, poolPromise } = require("../config/db");

async function findUserByEmail(email) {
    const pool = await poolPromise;
    const result = await pool.request().input("email", sql.NVarChar, email)
        .query("SELECT * FROM Users WHERE email = @email");
    return result.recordset[0];
}

async function createUser(username, email, hashedPassword) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("username", sql.NVarChar, username)
        .input("email", sql.NVarChar, email)
        .input("password", sql.NVarChar, hashedPassword)
        .query("INSERT INTO Users (username, email, password) OUTPUT INSERTED.* VALUES (@username, @email, @password)");
    return result.recordset[0];
}

module.exports = { findUserByEmail, createUser };
