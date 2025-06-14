const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const dbConfig = {
    connectionString: `Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server};`
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log("✅ Connected to SQL Server");
        return pool;
    })
    .catch(err => {
        console.error("❌ Database Connection Failed!", err);
    });

module.exports = { poolPromise, sql };




