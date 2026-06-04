import 'dotenv/config'
import pkg from 'pg'
//for connection at postgres database using pg package and export that connection to other files
const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export default pool