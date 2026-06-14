# GitHub Repo Explorer

A full-stack web app that lets you search any GitHub username and view their public profile and repositories. Built with React, Node.js, PostgreSQL, and deployed on Netlify + Render + Supabase.

🔗 **Live Demo:** https://githubrepoexplorerrrr.netlify.app
🔗 **Backend API:** https://github-repo-explorer-fa20.onrender.com

---

## Why a backend proxy?

The frontend never calls the GitHub API directly. All requests go through the Node.js backend for two reasons:

1. **Token security** — the GitHub personal access token lives in the server's environment variables and is never exposed to the browser
2. **Caching** — responses are cached in PostgreSQL (Supabase) for 1 hour to avoid hitting GitHub's rate limit (60 req/hr unauthenticated, 5000 with token)

---

## Architecture

```
Browser (React)
      ↓
Netlify (frontend)
      ↓
Render (Node.js + Express backend)
      ↓
  ┌───────────────┐
  │  Cache layer  │
  └───────────────┘
      ↓         ↓
 Supabase    GitHub API
(PostgreSQL)  (api.github.com)
```

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL (Supabase) |
| Frontend hosting | Netlify |
| Backend hosting | Render |
| HTTP client | Axios |
| DB client | node-postgres (pg) |

---

## Features

### Implemented
- Search any GitHub username
- View public profile — avatar, name, bio, followers, following, public repo count, location
- View list of public repositories with name, description, language badge, stars, forks, last updated date
- Sort repositories by last updated, most stars, or name
- Click any repo to expand and see open issues, default branch, visibility, watchers
- Backend caches responses for 1 hour (cache-aside pattern with PostgreSQL)
- Recently searched usernames persist in localStorage (last 5 searches)
- Loading skeleton animation while fetching
- Error handling — 404 for unknown users, rate limit messages, network errors
- Input validation on both frontend and backend
- Pagination — load more repositories (30 per page)
- Language usage chart across all repos

---

## Project structure

```
github-repo-explorer/
├── client/                  ← React app (Vite)
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── components/
│           ├── SearchBar.jsx
│           ├── ProfileCard.jsx
│           ├── RepoList.jsx
│           ├── Skeleton.jsx
│           └── LangChart.jsx
├── server/                  ← Node.js + Express
│   ├── index.js
│   ├── routes/
│   │   └── github.js
│   ├── services/
│   │   ├── githubService.js
│   │   └── cacheService.js
│   └── db/
│       ├── index.js
│       └── migrate.js
├── .env.example
└── README.md
```

---

## Local setup

### Prerequisites

- Node.js v18+
- A GitHub personal access token ([generate here](https://github.com/settings/tokens))
- A Supabase project ([supabase.com](https://supabase.com))

### 1. Clone the repo

```bash
git clone https://github.com/Krrtik1122/github-repo-explorer.git
cd github-repo-explorer
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```
GITHUB_TOKEN=your_github_token_here
DATABASE_URL=postgresql://postgres:yourpassword@db.xxxx.supabase.co:5432/postgres
```

Run the database migration to create the cache table:

```bash
node db/migrate.js
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:3001`

### 3. Setup the frontend

```bash
cd ../client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/users/:username` | Get GitHub user profile |
| GET | `/api/users/:username/repos?page=1` | Get user's public repos (paginated) |

---

## Environment variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | GitHub personal access token |
| `DATABASE_URL` | Supabase PostgreSQL connection string |

---

## Deployment

### Backend — Render

- **Root directory:** `server`
- **Build command:** `npm install`
- **Start command:** `node index.js`
- **Environment variables:** `GITHUB_TOKEN`, `DATABASE_URL`

### Frontend — Netlify

- **Base directory:** `client`
- **Build command:** `npm run build`
- **Publish directory:** `client/dist`

---

## Caching design

The app uses the **cache-aside pattern**:

1. Request comes in for a username
2. Check `cached_responses` table in PostgreSQL
3. If found and under 1 hour old → return cached data instantly
4. If not found or expired → fetch from GitHub API, store in DB, return fresh data

Cache table schema:

```sql
CREATE TABLE cached_responses (
  cache_key   TEXT PRIMARY KEY,
  data        JSONB NOT NULL,
  fetched_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Cache keys follow the pattern:
- `user:torvalds` — profile data
- `repos:torvalds:page:1` — repos page 1

---

## What could be improved next

### Performance
- **Redis cache** instead of PostgreSQL for sub-millisecond cache reads
- **CDN caching** for static assets
- **Debounced search-as-you-type** instead of button click
- **Request deduplication** — if two users search the same username simultaneously, only make one GitHub API call

### Features
- **GitHub OAuth login** — let users authenticate to get 5000 req/hr instead of 60
- **Compare two users** — side-by-side profile and repo comparison
- **Repo README preview** — fetch and render README.md inline on repo expand
- **Follow graph** — visualize who a user follows and who follows them
- **Rate limit indicator** — show remaining GitHub API calls (from response headers)
- **Manual cache refresh** — button to force fresh data bypassing cache
- **Export to CSV** — download repo list as spreadsheet

### Code quality
- **TypeScript** — add type safety across frontend and backend
- **Unit tests** — Jest for backend services, React Testing Library for components
- **API rate limiting** — protect your own backend with express-rate-limit
- **Helmet + CORS hardening** — tighter security headers
- **Environment-based API URL** — use `VITE_API_URL` env var instead of hardcoded Render URL

### Monitoring
- **Error tracking** — Sentry for frontend and backend errors
- **Uptime monitoring** — keep Render from sleeping with a cron ping
- **Cache analytics** — track hit/miss ratio in a `/stats` endpoint

---

## License

MIT
