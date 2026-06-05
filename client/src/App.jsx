import { useState } from 'react'
import SearchBar from './components/SearchBar'
import ProfileCard from './components/ProfileCard'
import RepoList from './components/RepoList'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (searchUsername) => {
    setLoading(true)
    setError(null)
    setUser(null)
    setRepos([])

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`http://localhost:3001/api/users/${searchUsername}`),
        fetch(`http://localhost:3001/api/users/${searchUsername}/repos`)
      ])

      if (!userRes.ok) {
        const err = await userRes.json()
        throw new Error(err.error || 'User not found')
      }

      const userData = await userRes.json()
      const reposData = await reposRes.json()

      setUser(userData)
      setRepos(reposData.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

return (
    <div className="app">
      <h1>GitHub Repo Explorer</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">⚠️ {error}</p>}
      {user && <ProfileCard user={user} />}
      {user && !loading && repos.length === 0 && (
        <p className="status">No public repositories found.</p>
      )}
      {repos.length > 0 && <RepoList repos={repos} />}
    </div>
  )
}

export default App