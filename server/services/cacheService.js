import pool from '../db/index.js'

const TTL_HOURS = 1

export async function getFromCache(key) {
  const result = await pool.query(
    `SELECT data, fetched_at FROM cached_responses WHERE cache_key = $1`,
    [key]
  )

  if (result.rows.length === 0) return null

  const { data, fetched_at } = result.rows[0]
  const ageInHours = (Date.now() - new Date(fetched_at).getTime()) / (1000 * 60 * 60)

  if (ageInHours > TTL_HOURS) return null

  return data
}

export async function saveToCache(key, data) {
  await pool.query(
    `INSERT INTO cached_responses (cache_key, data, fetched_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (cache_key)
     DO UPDATE SET data = $2, fetched_at = NOW()`,
    [key, JSON.stringify(data)]
  )
}