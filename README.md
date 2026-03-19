# Shipify — AI DevOps Copilot

> Paste any GitHub repo URL. Get a production-ready Dockerfile, CI/CD pipeline,
> docker-compose, and nginx config — instantly.

![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![AI](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-orange)

## What It Does

Shipify reads your GitHub repository and uses **Groq AI (LLaMA 3.3 70B)** to generate:

- **Dockerfile** — multi-stage, optimized, with health checks
- **docker-compose.yml** — all services detected automatically
- **GitHub Actions CI/CD** — build, test, deploy pipeline
- **nginx.conf** — reverse proxy with gzip and caching
- **.env.example** — all environment variables from your code

## How It Works

1. Paste a GitHub repo URL
2. Shipify fetches repo structure via GitHub API
3. Groq AI analyzes the stack and generates configs
4. Download or copy Dockerfile, CI/CD, nginx config instantly

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React, custom CSS                 |
| Backend    | Node.js, Express                  |
| AI         | Groq · LLaMA 3.3 70B (free tier)  |
| GitHub API | Octokit REST                      |
| Database   | PostgreSQL (in-memory fallback)   |
| DevOps     | Docker, GitHub Actions, nginx     |

## Quick Start (Local)

### Prerequisites
- Node.js 20+
- Groq API key — free at [console.groq.com](https://console.groq.com)
- GitHub Personal Access Token — for higher rate limits

### 1. Clone
```bash
git clone https://github.com/<your-username>/shipify
cd shipify
```

### 2. Set env variables
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your keys
```
```env
GROQ_API_KEY=your_groq_api_key_from_console.groq.com
GITHUB_TOKEN=your_github_personal_access_token

# ── Optional ────────────────────────────────────────────────
PORT=8000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://shipify:shipify@localhost:5432/shipify
NODE_ENV=development
```

### 3. Run locally
```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm start
```
Open http://localhost:3000

### 4. Run with Docker (production)
```bash
docker-compose up -d
```
Open http://localhost

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/analyze | Analyze repo + generate configs |
| GET | /api/history | Fetch past generations |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| GROQ_API_KEY | Yes | Get free at console.groq.com |
| GITHUB_TOKEN | No | Increases GitHub API rate limit |
| DATABASE_URL | No | PostgreSQL URL (uses in-memory if not set) |
| PORT | No | Backend port (default: 8000) |
| FRONTEND_URL | No | Frontend origin for CORS (default: localhost:3000) |
| NODE_ENV | No | development or production |

## File Structure
```
shipify/
├── backend/
│   ├── src/
│   │   ├── index.js                 ← Express server entry
│   │   ├── routes/
│   │   │   ├── analyze.js           ← POST /api/analyze
│   │   │   └── history.js           ← GET /api/history
│   │   ├── services/
│   │   │   ├── githubService.js     ← Fetch repo + detect stack
│   │   │   ├── groqService.js       ← Generate configs with Groq AI
│   │   │   └── dbService.js         ← PostgreSQL / in-memory storage
│   │   └── utils/logger.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js                   ← Root component + nav
│   │   ├── App.css                  ← Full design system
│   │   ├── pages/
│   │   │   ├── Generator.js         ← Main UI
│   │   │   └── History.js           ← Past generations
│   │   └── components/
│   │       ├── ConfigViewer.js      ← Tabbed code viewer
│   │       ├── LoadingSteps.js      ← Animated progress
│   │       └── StackBadge.js        ← Color-coded tech badges
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## License

MIT
