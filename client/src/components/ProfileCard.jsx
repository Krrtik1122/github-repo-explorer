function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <img src={user.avatar_url} alt={user.login} />
      <div className="profile-info">
        <h2>{user.name || user.login}</h2>
        <p className="username">@{user.login}</p>
        {user.bio && <p className="bio">{user.bio}</p>}
        <div className="stats">
          <span>👥 {user.followers} followers</span>
          <span>📦 {user.public_repos} repos</span>
          {user.location && <span>📍 {user.location}</span>}
        </div>
      </div>
    </div>
  )
}

export default ProfileCard