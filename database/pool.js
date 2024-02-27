const { Pool } = require('pg');

const pool = new Pool({
    user: 'olga',
    host: 'localhost',
    database: 'store-project',
    password: 'admin',
    port: 5432,
});

module.exports = pool;