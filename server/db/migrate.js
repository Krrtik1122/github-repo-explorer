import pool from './index.js'

const createTable = `
  CREATE TABLE IF NOT EXISTS cached_responses (
    cache_key   TEXT PRIMARY KEY,
    data        JSONB NOT NULL,
    fetched_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
`

try {
  await pool.query(createTable)
  console.log('cached_responses table ready')
} catch (err) {
  console.error('Migration failed:', err.message)
}

await pool.end()