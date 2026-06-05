function RepoList({ repos }) {
  return (
    <div className="repo-list">
      <h3>Repositories</h3>
      {repos.map((repo) => (
        <div key={repo.id} className="repo-card">
          <div className="repo-header">
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              {repo.name}
            </a>
            {repo.language && (
              <span className="language">{repo.language}</span>
            )}
          </div>
          {repo.description && <p>{repo.description}</p>}
          <div className="repo-stats">
            <span>⭐ {repo.stargazers_count}</span>
            <span>🍴 {repo.forks_count}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RepoList