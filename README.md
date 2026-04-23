<div align="center">

```
███████╗██╗  ██╗██╗██████╗ ██╗███████╗██╗   ██╗
██╔════╝██║  ██║██║██╔══██╗██║██╔════╝╚██╗ ██╔╝
███████╗███████║██║██████╔╝██║█████╗   ╚████╔╝ 
╚════██║██╔══██║██║██╔═══╝ ██║██╔══╝    ╚██╔╝  
███████║██║  ██║██║██║     ██║██║        ██║   
╚══════╝╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝        ╚═╝   
```

### *Your entire DevOps setup. Generated in seconds.*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Try_Shipify-2496ED?style=for-the-badge)](#)
[![Groq AI](https://img.shields.io/badge/Powered_by-LLaMA_3.3_70B-orange?style=for-the-badge&logo=meta)](https://console.groq.com)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

> **You've built the app. Now comes the part nobody wants to do.**
> *Shipify does it for you — Dockerfile, CI/CD, compose, nginx — in one paste.*

<br/>

![Shipify Demo Preview](https://raw.githubusercontent.com/yourusername/shipify/main/docs/assets/demo-preview.gif)

</div>

---

## ✦ What Is Shipify?

Shipify is an **AI DevOps copilot** that takes any GitHub repository URL and generates a complete, production-ready deployment stack — automatically detecting your language, framework, services, and environment variables, then handing you five files that would normally take hours to write.

No templates. No guessing. It reads your actual codebase.

---

## ✦ What You Get

Paste a GitHub URL. Get all of this, tailored to your exact stack:

| File | What's inside |
|---|---|
| `Dockerfile` | Multi-stage build, optimized layer caching, health checks |
| `docker-compose.yml` | Every service auto-detected and wired — postgres, redis, whatever you use |
| `.github/workflows/ci.yml` | Build → Test → Deploy pipeline via GitHub Actions |
| `nginx.conf` | Reverse proxy, gzip compression, static asset caching |
| `.env.example` | Every environment variable scraped directly from your codebase |

---

## ✦ How It Works

```
GitHub Repo URL
       │
       ▼
┌──────────────────┐
│   GitHub API     │
│   via Octokit    │
└────────┬─────────┘
         │  source files · package.json · deps
         ▼
┌──────────────────────────────┐
│       Stack Detector         │
│                              │
│  • Language & framework      │
│  • Services (DB, cache, etc) │
│  • Env vars across codebase  │
│  • Build & run commands      │
└────────┬─────────────────────┘
         │  structured context
         ▼
┌──────────────────────────────┐
│   Groq AI — LLaMA 3.3 70B   │
└────┬──────┬──────┬───────────┘
     │      │      │
     ▼      ▼      ▼
Dockerfile  CI/CD  nginx
  compose  .env
```

Every file is generated with your actual stack in mind — not a generic template with placeholders.

---

## ✦ Why This Exists

Writing DevOps config is one of the most time-consuming, error-prone parts of shipping software. Most developers copy-paste from old projects, tweak blindly, and hope it works in production.

Shipify reads what you actually built and generates config that fits it — multi-stage Docker builds for the right runtime, CI steps that match your test commands, compose services for the exact databases your code connects to, nginx config with the right proxy rules for your framework.

The difference between a generic Dockerfile and one that's actually optimized for your stack is hours of debugging. Shipify closes that gap in seconds.

---

## ✦ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React + custom CSS | Clean, fast, no UI framework overhead |
| Backend | Node.js + Express | Simple, proven, handles concurrent generations well |
| AI Engine | Groq · LLaMA 3.3 70B | Free tier, extremely fast inference, excellent code output |
| GitHub Integration | Octokit REST | Official GitHub SDK — reliable, typed, well-maintained |
| Storage | PostgreSQL + in-memory fallback | Works with or without a database configured |

---

## ✦ Quick Start

### Prerequisites

```bash
node >= 20.0.0
npm  >= 9.0.0
```

You'll also need:
- **Groq API key** — free at [console.groq.com](https://console.groq.com)
- **GitHub PAT** *(recommended)* — bumps rate limit from 60 → 5,000 req/hr

### Option A — Local Dev

```bash
# 1. Clone
git clone https://github.com/yourusername/shipify.git
cd shipify

# 2. Environment
cp backend/.env.example backend/.env
# Add GROQ_API_KEY (required) and GITHUB_TOKEN (recommended)

# 3. Start backend + frontend
cd backend && npm install && npm run dev &
cd ../frontend && npm install && npm start
```

Open [http://localhost:3000](http://localhost:3000)

### Option B — Docker (Recommended)

```bash
git clone https://github.com/yourusername/shipify.git
cd shipify
cp backend/.env.example backend/.env
docker-compose up -d
```

Open [http://localhost](http://localhost)

---

## ✦ Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | — | Free at [console.groq.com](https://console.groq.com) |
| `GITHUB_TOKEN` | Recommended | — | GitHub PAT — raises API limits to 5,000 req/hr |
| `DATABASE_URL` | No | in-memory | PostgreSQL connection string |
| `PORT` | No | `8000` | Backend server port |
| `FRONTEND_URL` | No | `http://localhost:3000` | Allowed CORS origin |
| `NODE_ENV` | No | `development` | `development` or `production` |

---

## ✦ API Reference

### `POST /api/analyze`

Analyzes a repository and generates all five DevOps config files.

```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repoUrl": "https://github.com/owner/repo"}'
```

**Response**

```json
{
  "stack": {
    "language": "Node.js",
    "framework": "Express",
    "services": ["postgres", "redis"]
  },
  "dockerfile": "FROM node:20-alpine AS base...",
  "dockerCompose": "version: '3.9'...",
  "githubActions": "name: CI/CD...",
  "nginxConf": "upstream backend {...}",
  "envExample": "DATABASE_URL=\nREDIS_URL=\n..."
}
```

### `GET /api/history`

Returns previously generated configs, paginated.

---

## ✦ Project Structure

```
shipify/
├── backend/
│   └── src/
│       ├── index.js              # Express entry point
│       ├── routes/
│       │   ├── analyze.js        # POST /api/analyze
│       │   └── history.js        # GET /api/history
│       └── services/
│           ├── githubService.js  # Repo fetching + stack detection
│           ├── groqService.js    # AI config generation
│           └── dbService.js      # PostgreSQL / in-memory storage
│
├── frontend/
│   └── src/
│       ├── App.js                # Root component + routing
│       ├── pages/
│       │   ├── Generator.js      # Main UI — paste URL, get configs
│       │   └── History.js        # Past generations browser
│       └── components/
│           ├── ConfigViewer.js   # Tabbed syntax-highlighted viewer
│           ├── LoadingSteps.js   # Animated progress indicator
│           └── StackBadge.js     # Color-coded tech badges
│
├── docker-compose.yml
└── README.md
```

---

## ✦ Features

| Feature | Status |
|---|---|
| 🐳 Dockerfile generation (multi-stage, optimized) | ✅ Done |
| 🔧 docker-compose with auto-detected services | ✅ Done |
| ⚙️ GitHub Actions CI/CD pipeline | ✅ Done |
| 🌐 nginx reverse proxy config | ✅ Done |
| 🔐 .env.example from codebase scan | ✅ Done |
| 🗃️ Generation history with pagination | ✅ Done |
| 🦊 GitLab URL support | 📋 Planned |
| 🪣 Bitbucket URL support | 📋 Planned |
| ☸️ Kubernetes manifest generation | 📋 Planned |
| 🏗️ Terraform / IaC output | 📋 Planned |
| 🚄 One-click deploy to Railway / Render | 📋 Planned |
| 🧩 VS Code extension | 📋 Planned |

---

## ✦ Roadmap

- **v1.0** — Full config generation for GitHub repos ← *we are here*
- **v1.5** — GitLab + Bitbucket support, generation history
- **v2.0** — Kubernetes manifests + Helm charts
- **v2.5** — Terraform / infrastructure-as-code output
- **v3.0** — One-click deploy to Railway, Render, Fly.io
- **v3.5** — VS Code extension — generate configs without leaving your editor

---

## ✦ Contributing

```bash
# 1. Fork the repo, then clone
git clone https://github.com/yourusername/shipify.git

# 2. Create a feature branch
git checkout -b feat/your-feature-name

# 3. Make your changes
git commit -m "feat: describe what you built"

# 4. Push and open a PR into main
git push origin feat/your-feature-name
```

| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code cleanup |
| `docs:` | README or comments |
| `chore:` | Deps, config, tooling |

---

## ✦ License

MIT — see [LICENSE](./LICENSE) for full terms.

---

<div align="center">

**Shipping is the hardest part.**
*Shipify makes it the easiest one.*

<br/>

Built with  LLaMA 3.3 · Octokit · Node.js · React · Docker

</div>
