# 🚢 Shipify — AI DevOps Copilot

> Paste a GitHub repo URL. Get a production-ready **Dockerfile**, **CI/CD pipeline**, **docker-compose**, and **nginx config** — in seconds.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](#license)
[![AI](https://img.shields.io/badge/Groq-LLaMA%203.3%2070B-orange?logo=meta)](https://console.groq.com)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](https://docker.com)

---

## ✨ What Shipify Does

Most developers spend hours writing boilerplate DevOps configs. Shipify eliminates that. Point it at any GitHub repository and it auto-detects your stack, then generates five production-grade files tailored to your project:

| Output | What you get |
|--------|-------------|
| `Dockerfile` | Multi-stage build, optimized layers, health checks |
| `docker-compose.yml` | All services detected and wired automatically |
| `.github/workflows/ci.yml` | Build → Test → Deploy pipeline via GitHub Actions |
| `nginx.conf` | Reverse proxy with gzip compression and caching |
| `.env.example` | All environment variables scraped from your codebase |

---

## 🏗️ Architecture

```
GitHub Repo URL
      │
      ▼
┌─────────────────┐     ┌──────────────────────┐
│  GitHub API      │────▶│  Stack Detector       │
│  (Octokit REST)  │     │  (languages, deps,    │
└─────────────────┘     │   services, env vars) │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │  Groq AI              │
                         │  LLaMA 3.3 70B        │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              Dockerfile    docker-compose    CI/CD + nginx
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+**
- **Groq API key** — free at [console.groq.com](https://console.groq.com)
- **GitHub PAT** *(optional)* — raises API rate limits from 60 → 5,000 req/hr

### Option A — Local Dev

```bash
# 1. Clone
git clone https://github.com/<your-username>/shipify && cd shipify

# 2. Configure environment
cp backend/.env.example backend/.env
# Fill in GROQ_API_KEY (required) and GITHUB_TOKEN (recommended)

# 3. Start backend + frontend
cd backend && npm install && npm run dev &
cd ../frontend && npm install && npm start
```

Open **http://localhost:3000**

### Option B — Docker (Recommended)

```bash
git clone https://github.com/<your-username>/shipify && cd shipify
cp backend/.env.example backend/.env   # add your keys
docker-compose up -d
```

Open **http://localhost**

---

## ⚙️ Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | ✅ Yes | — | Get free at [console.groq.com](https://console.groq.com) |
| `GITHUB_TOKEN` | Recommended | — | GitHub PAT for higher API rate limits |
| `DATABASE_URL` | No | in-memory | PostgreSQL connection string |
| `PORT` | No | `8000` | Backend server port |
| `FRONTEND_URL` | No | `http://localhost:3000` | Allowed CORS origin |
| `NODE_ENV` | No | `development` | `development` or `production` |

---

## 📡 API Reference

### `POST /api/analyze`

Analyze a repository and generate all DevOps configs.

**Request**
```json
{
  "repoUrl": "https://github.com/owner/repo"
}
```

**Response**
```json
{
  "stack": { "language": "Node.js", "framework": "Express", "services": ["postgres", "redis"] },
  "dockerfile": "...",
  "dockerCompose": "...",
  "githubActions": "...",
  "nginxConf": "...",
  "envExample": "..."
}
```

### `GET /api/history`

Returns previously generated configs (paginated).

---

## 📁 Project Structure

```
shipify/
├── backend/
│   └── src/
│       ├── index.js                 # Express entry point
│       ├── routes/
│       │   ├── analyze.js           # POST /api/analyze
│       │   └── history.js           # GET /api/history
│       └── services/
│           ├── githubService.js     # Repo fetching & stack detection
│           ├── groqService.js       # AI config generation
│           └── dbService.js         # PostgreSQL / in-memory storage
│
├── frontend/
│   └── src/
│       ├── App.js                   # Root component & routing
│       ├── pages/
│       │   ├── Generator.js         # Main UI
│       │   └── History.js           # Past generations
│       └── components/
│           ├── ConfigViewer.js      # Tabbed syntax-highlighted viewer
│           ├── LoadingSteps.js      # Animated progress indicator
│           └── StackBadge.js        # Color-coded technology badges
│
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, custom CSS |
| Backend | Node.js, Express |
| AI | Groq · LLaMA 3.3 70B (free tier) |
| GitHub Integration | Octokit REST |
| Storage | PostgreSQL with in-memory fallback |

---

## 🗺️ Roadmap

- [ ] Support GitLab and Bitbucket URLs
- [ ] Kubernetes manifest generation
- [ ] Terraform / infrastructure-as-code output
- [ ] One-click deploy to Railway / Render
- [ ] VS Code extension

---

## 🤝 Contributing

Contributions are welcome! Please open an issue before submitting a PR for large changes.

```bash
git checkout -b feat/your-feature
# make changes
git commit -m "feat: describe your change"
git push origin feat/your-feature
```

---

## 📄 License

[MIT](LICENSE) © 2025 Shipify Contributors
