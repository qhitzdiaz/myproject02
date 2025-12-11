const pg = require('pg');
const pool = new pg.Pool({
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'supplydb'
});

// Initialize database
const fs = require('fs');
const path = require('path');

const initDB = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'config', 'init-db.sql'), 'utf-8');
    await pool.query(sql);
    console.log('Supply chain database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initDB();

module.exports = pool;
