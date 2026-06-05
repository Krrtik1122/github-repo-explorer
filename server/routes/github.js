import { Router } from 'express'
import { getUser, getUserRepos } from '../services/githubService.js'
import { getFromCache, saveToCache } from '../services/cacheService.js'

const router = Router()

router.get('/users/:username', async (req, res) => {
  const { username } = req.params
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
    const message = status === 404 ? 'User not found' : 'GitHub API error'
    res.status(status).json({ error: message })
  }
})

router.get('/users/:username/repos', async (req, res) => {
  const { username } = req.params
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
    res.status(status).json({ error: 'Could not fetch repos' })
  }
})

export default router