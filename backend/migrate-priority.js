require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query("ALTER TABLE todos ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'normal'")
  .then(() => { console.log('Priority column added'); pool.end(); })
  .catch(e => { console.error(e); pool.end(); });
