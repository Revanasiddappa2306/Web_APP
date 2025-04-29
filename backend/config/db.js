const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true,
        enableArithAbort: true
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log("✅ Connected to SQL Server using Windows Authentication");
        return pool;
    })
    .catch(err => {
        console.error("❌ Database Connection Failed!", err);
    });

module.exports = { poolPromise, sql };




