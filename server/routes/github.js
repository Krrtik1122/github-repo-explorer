import { Router } from 'express'
import { getUser, getUserRepos } from '../services/githubService.js'

const router = Router()

router.get('/users/:username', async (req, res) => {
  try {
    const user = await getUser(req.params.username)
    res.json(user)
  } catch (err) {
    const status = err.response?.status || 500
    const message = status === 404 ? 'User not found' : 'GitHub API error'
    res.status(status).json({ error: message })
  }
})

router.get('/users/:username/repos', async (req, res) => {
  try {
    const repos = await getUserRepos(req.params.username)
    res.json(repos)
  } catch (err) {
    const status = err.response?.status || 500
    res.status(status).json({ error: 'Could not fetch repos' })
  }
})

export default router