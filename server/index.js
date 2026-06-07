import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import githubRouter from './routes/github.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors({ 
  origin: [
    'http://localhost:5173',
    /\.vercel\.app$/,
     'https://github-repo-explorerrrr.vercel.app'
  ] 
}))



app.use(express.json())


app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', githubRouter)

app.get('/debug', (req, res) => {
  res.json({
    hasToken: !!process.env.GITHUB_TOKEN,
    hasDb: !!process.env.DATABASE_URL,
    tokenLength: process.env.GITHUB_TOKEN?.length || 0
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})