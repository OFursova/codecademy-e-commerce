const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
    user: 'olga',
    host: 'localhost',
    database: 'store-project',
    password: 'admin',
    port: 5432, // default PostgreSQL port
});

module.exports = pool;