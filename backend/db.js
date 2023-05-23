const { Pool } = require('pg');
const pool = new Pool({
    user: "postgres",
    password: "rootroot",
    host: "localhost",
    port: "5433",
    database: "Company",
});

module.exports = pool