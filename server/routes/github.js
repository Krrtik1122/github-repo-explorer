import { Router } from 'express'
import { getUser, getUserRepos } from '../services/githubService.js'
import { getFromCache, saveToCache } from '../services/cacheService.js'

const router = Router()

// Input validation helper
function isValidUsername(username) {
  return /^[a-zA-Z0-9-]{1,39}$/.test(username)
}

router.get('/users/:username', async (req, res) => {
  const { username } = req.params

  if (!isValidUsername(username)) {
    return res.status(400).json({ error: 'Invalid GitHub username' })
  }

  const cacheKey = `user:${username}`

  try {
    const cached = await getFromCache(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return res.json({ ...cached, _cache: 'hit' })
    }

    console.log(`Cache MISS: ${cacheKey}`)
    const user = await getUser(username)
    await saveToCache(cacheKey, user)
    res.json({ ...user, _cache: 'miss' })
  } catch (err) {
    const status = err.response?.status || 500
    if (status === 404) return res.status(404).json({ error: 'User not found' })
    if (status === 403) return res.status(403).json({ error: 'GitHub rate limit exceeded, try again later' })
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.get('/users/:username/repos', async (req, res) => {
  const { username } = req.params

  if (!isValidUsername(username)) {
    return res.status(400).json({ error: 'Invalid GitHub username' })
  }

  const cacheKey = `repos:${username}`

  try {
    const cached = await getFromCache(cacheKey)
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`)
      return res.json({ data: cached, _cache: 'hit' })
    }

    console.log(`Cache MISS: ${cacheKey}`)
    const repos = await getUserRepos(username)
    await saveToCache(cacheKey, repos)
    res.json({ data: repos, _cache: 'miss' })
  } catch (err) {
    const status = err.response?.status || 500
    if (status === 404) return res.status(404).json({ error: 'User not found' })
    if (status === 403) return res.status(403).json({ error: 'GitHub rate limit exceeded' })
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router