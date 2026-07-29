# 🚀 ConsultLegal — Complete Deployment Guide
> **Written by:** Antigravity AI  
> **Date:** 29 July 2026  
> **Purpose:** Step-by-step deployment guide so you can do this independently next time.

---

## 📋 Table of Contents
1. [What is This Project?](#1-what-is-this-project)
2. [Architecture — How Everything Connects](#2-architecture)
3. [Tools & Technologies Used](#3-tools--technologies-used)
4. [Local Development Setup](#4-local-development-setup)
5. [SSH — Connecting to Server](#5-ssh--connecting-to-server)
6. [Server Setup — What We Installed](#6-server-setup)
7. [Deploying the App](#7-deploying-the-app)
8. [GitHub Actions CI/CD](#8-github-actions-cicd)
9. [What's Pending](#9-whats-pending)
10. [Quick Reference — All Commands](#10-quick-reference)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. What is This Project?

**ConsultLegal** is a full-stack web application for AI-powered legal document automation in India.

### Components:
| Component | Technology | Port | Purpose |
|-----------|-----------|------|---------|
| **Frontend** | Next.js 16 (React) | 3000 | User Interface — what users see |
| **Backend API** | NestJS (Node.js) | 4000 | Business logic, database operations |
| **Database 1** | PostgreSQL | 5432 | Users, auth, lawyers, payments data |
| **Database 2** | MongoDB | 27017 | Chat messages, documents |
| **Cache** | Redis | 6379 | Sessions, fast data access |
| **File Storage** | MinIO | 9000 | PDF and document storage (S3-compatible) |

---

## 2. Architecture

```
USER (Browser)
      │
      ▼
http://43.204.64.81:3000
      │
 Next.js (Frontend)
      │
      ├──► /api/* routes ──► NestJS API (port 4000)
      │                             │
      │                      ┌──────┼──────┐
      │                      ▼      ▼      ▼
      │                 PostgreSQL MongoDB Redis
      │                  (users)  (chat)  (cache)
      │
      └──► Static pages (HTML/CSS/JS served directly)
```

### What happens when a user visits the site:
1. Browser requests `http://43.204.64.81:3000`
2. Next.js serves the HTML page
3. User clicks "Login with Google" → Next.js calls `/api/auth` → NestJS verifies → PostgreSQL stores user
4. User creates a document → Frontend calls `POST /api/v1/documents` → NestJS processes → MongoDB stores
5. User chats with AI → `/api/v1/chat/ask` → NestJS calls Groq/Gemini AI → Response returned

---

## 3. Tools & Technologies Used

### 🖥️ Server
| Tool | What it is | Why we used it |
|------|-----------|----------------|
| **AWS EC2** | Virtual computer on Amazon's cloud | Hosts our application publicly |
| **Ubuntu 24.04** | Linux operating system | Industry standard for servers |
| **IP: 43.204.64.81** | Server's public address | How users/we reach the server |
| **ARM64 (aarch64)** | Server processor type | AWS Graviton — cheaper, energy-efficient |

### 🔐 SSH (Secure Shell)
| Concept | Meaning |
|---------|---------|
| **SSH** | Protocol to remotely control a server from terminal |
| **PEM file** | Private key file — like a password but more secure |
| **`cl_dev.pem`** | Our key to enter the server |
| **Port 22** | SSH runs on this port — must be open in Security Group |
| **`~/.ssh/config`** | Config file so we can type `ssh cl_dev` instead of long command |

### 🐳 Docker
| Concept | Meaning |
|---------|---------|
| **Docker** | Tool that runs applications in isolated "containers" |
| **Container** | A box with everything an app needs (like a mini-computer) |
| **Docker Compose** | Tool to run multiple containers together with one command |
| **Volume** | Persistent storage — data survives even if container restarts |
| **`docker-compose.dev.yml`** | Our config file for running databases locally |

### ⚙️ PM2 (Process Manager 2)
| Concept | Meaning |
|---------|---------|
| **PM2** | Keeps Node.js apps running — like a guardian for our app |
| **`pm2 start`** | Start an application |
| **`pm2 restart`** | Restart an application |
| **`pm2 logs`** | See application logs (output/errors) |
| **`pm2 save`** | Save current process list so it restores after reboot |
| **`pm2 startup`** | Configure PM2 to start automatically when server reboots |

### 🔧 Node.js Tools
| Tool | Purpose |
|------|---------|
| **npm install** | Download all code dependencies (libraries) |
| **npm run build** | Convert TypeScript/modern JS to plain JS the server can run |
| **`nest build`** | NestJS-specific build command (compiles API TypeScript → JavaScript) |
| **`next build`** | Next.js build — creates optimized production files |
| **Prisma** | Database toolkit — manages PostgreSQL schema and queries |
| **`prisma db push`** | Create/update database tables based on schema definition |

### 🔄 Git & GitHub
| Concept | Meaning |
|---------|---------|
| **Git** | Version control — tracks all code changes |
| **GitHub** | Cloud storage for Git repositories |
| **`git push`** | Upload local code changes to GitHub |
| **`git pull`** | Download latest code from GitHub to current machine |
| **`git clone`** | Download an entire repository for the first time |
| **Personal Access Token** | Password replacement for GitHub operations |

### 🏃 GitHub Actions
| Concept | Meaning |
|---------|---------|
| **GitHub Actions** | Automated workflows triggered by code events |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **Workflow** | A set of automated steps defined in a YAML file |
| **Job** | A group of steps in a workflow |
| **Secret** | Encrypted variable stored in GitHub (passwords, keys) |
| **`on: push`** | Trigger — run workflow when code is pushed |

---

## 4. Local Development Setup

### What runs locally on your laptop:

```bash
# Terminal 1 — Start Databases (Docker)
docker compose -f docker-compose.dev.yml up -d

# Terminal 2 — Start Backend API (NestJS)
cd apps/api
npm run start:dev

# Terminal 3 — Start Frontend (Next.js)
npm run dev
```

### Local URLs:
- Frontend: http://localhost:3000
- API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs

### Environment Files:
- **`apps/api/.env`** — API configuration (database URLs, API keys, etc.)
- **`.env`** — Frontend configuration (auth secrets, API URL)

> ⚠️ **NEVER commit .env files to GitHub** — they contain secrets!

---

## 5. SSH — Connecting to Server

### What SSH is:
SSH (Secure Shell) lets you control a remote server from your terminal, as if you were sitting in front of it.

### One-time SSH Config Setup:
```
File: C:\Users\VINEET YADAV\.ssh\config

Host cl_dev
    HostName 43.204.64.81
    User ubuntu
    IdentityFile ~/.ssh/cl_dev.pem
```

After this config, you can connect with just:
```bash
ssh cl_dev
# Instead of the long command:
ssh -i /path/to/cl_dev.pem ubuntu@43.204.64.81
```

### Why this works:
- **`Host cl_dev`** — nickname/alias for this server
- **`HostName`** — actual IP of the server
- **`User ubuntu`** — username on the server (AWS EC2 Ubuntu default is `ubuntu`)
- **`IdentityFile`** — path to the PEM key file

### PEM File Permissions (Windows):
```powershell
# Windows needs restricted permissions on the PEM file
# Otherwise SSH refuses to use it (security feature)
$pemPath = "D:\consultlegal-fullstack\cl_dev.pem"
$acl = Get-Acl $pemPath
$acl.SetAccessRuleProtection($true, $false)
# ... (only your user should have access)
```

### Connecting from Git Bash (Windows):
```bash
# Using SSH config shortcut
ssh cl_dev

# OR using full command
ssh -i /d/consultlegal-fullstack/cl_dev.pem ubuntu@43.204.64.81
```

> ⚠️ **Note:** PowerShell sometimes has issues with interactive SSH. Always use Git Bash for interactive SSH sessions.

---

## 6. Server Setup

### What the server had before us:
- Ubuntu 24.04.4 LTS ✅ (already installed)
- Git 2.43.0 ✅ (already installed)
- Nothing else!

### What we installed:

#### Step 1: Node.js 20
```bash
# Download NodeSource setup script and run it
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

**Why Node.js 20?**
- Our app uses Next.js and NestJS — both require Node.js
- Version 20 is LTS (Long Term Support) — stable for production

#### Step 2: Docker + Docker Compose
```bash
# Update package list
sudo apt-get update

# Install Docker and Docker Compose
sudo apt-get install -y docker.io docker-compose-v2

# Enable Docker to start automatically on boot
sudo systemctl enable docker
sudo systemctl start docker

# Add ubuntu user to docker group (so we don't need sudo every time)
sudo usermod -aG docker ubuntu

# After this, logout and login again for group to take effect
exit
# reconnect...
ssh -i /d/consultlegal-fullstack/cl_dev.pem ubuntu@43.204.64.81

# Verify
docker --version        # Docker version 29.1.3
docker compose version  # Docker Compose version 2.40.3
```

**Why Docker?**
- Databases (PostgreSQL, MongoDB, Redis) are complex to install manually
- Docker gives us pre-configured, ready-to-use containers
- Data is persisted in Docker volumes (survives restarts)

#### Step 3: PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify
pm2 --version
```

**Why PM2?**
- Node.js apps crash sometimes — PM2 automatically restarts them
- Without PM2: app dies → users get errors → you have to manually restart
- With PM2: app crashes → PM2 restarts in seconds → users barely notice

---

## 7. Deploying the App

### Complete deployment flow (what we did):

#### Step 1: Clone code from GitHub
```bash
# On the server (inside SSH session)
cd ~
git clone https://github.com/Vineet-SimtelAI/Vineet-Simtel-Consult-Legal-AI.git consultlegal
cd consultlegal
```

**What this does:** Downloads all code from GitHub to `/home/ubuntu/consultlegal/`

#### Step 2: Create Environment Files
```bash
# API environment variables
cat > apps/api/.env << 'EOF'
DATABASE_URL=postgresql://admin:consultlegal2026@localhost:5432/consultlegal
MONGODB_URI=mongodb://admin:consultlegal2026@localhost:27017/consultlegal?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=consultlegal2026
JWT_SECRET=consultlegal-jwt-secret-2026
NEXTAUTH_SECRET=consultlegal-nextauth-secret-2026
NEXTAUTH_URL=http://43.204.64.81:3000
PORT=4000
API_URL=http://43.204.64.81:4000
NEXT_PUBLIC_API_URL=http://43.204.64.81:4000
# ... (all other env vars)
EOF

# Frontend environment variables
cat > .env << 'EOF'
NEXTAUTH_SECRET=consultlegal-nextauth-secret-2026
NEXTAUTH_URL=http://43.204.64.81:3000
API_URL=http://43.204.64.81:4000
NEXT_PUBLIC_API_URL=http://43.204.64.81:4000
EOF
```

**What `cat > file << 'EOF'` does:**
- `cat >` = write to file
- `<< 'EOF'` = everything until you type `EOF` again goes into the file
- This is a way to write multi-line content to a file in terminal

#### Step 3: Start Databases
```bash
docker compose -f docker-compose.dev.yml up -d

# Verify all 3 are running
docker ps
```

**What `-d` means:** "detached mode" — runs in background, doesn't block terminal

**Expected output:**
```
NAMES                   STATUS
consultlegal-postgres   Up (healthy)
consultlegal-redis      Up (healthy)
consultlegal-mongo      Up (healthy)
```

#### Step 4: Install Dependencies
```bash
# Install API dependencies
npm install --prefix apps/api

# Install Frontend dependencies
npm install
```

**What this does:** Downloads all Node.js libraries listed in `package.json`

#### Step 5: Setup Database Tables
```bash
cd apps/api
npx prisma db push
cd ~/consultlegal
```

**What Prisma db push does:**
- Reads `apps/api/prisma/schema.prisma`
- Creates all tables in PostgreSQL that are defined there
- If tables exist, updates them to match schema

#### Step 6: Build API
```bash
cd apps/api
npm run build
cd ~/consultlegal
```

**What build does:**
- TypeScript files (`.ts`) → JavaScript files (`.js`)
- Server can only run plain JavaScript, not TypeScript
- Output goes to `apps/api/dist/` folder

#### Step 7: Start API with PM2
```bash
pm2 start "node dist/main.js" \
  --name "consultlegal-api" \
  --cwd /home/ubuntu/consultlegal/apps/api
```

**Breaking down this command:**
- `pm2 start` — start a new process
- `"node dist/main.js"` — the actual command to run
- `--name "consultlegal-api"` — give it a name so we can reference it later
- `--cwd /home/ubuntu/consultlegal/apps/api` — run from this directory (important! .env file must be found)

#### Step 8: Build Frontend
```bash
npm run build
```

**What Next.js build does:**
- Creates optimized production HTML/CSS/JS files
- Pre-renders static pages for faster loading
- Output in `.next/` folder

#### Step 9: Start Frontend with PM2
```bash
pm2 start "npx next start -p 3000" \
  --name "consultlegal-web" \
  --cwd /home/ubuntu/consultlegal
```

#### Step 10: Configure Auto-restart on Reboot
```bash
# Save current process list
pm2 save

# Generate startup script
pm2 startup
# This outputs a command — copy and run it:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

**What this does:**
- Creates a system service (`pm2-ubuntu.service`)
- When server reboots → systemd starts PM2 → PM2 starts our apps

---

## 8. GitHub Actions CI/CD

### File Location:
```
.github/workflows/deploy.yml
```

### What it does:
Every time you push code to the `main` branch:
1. GitHub detects the push
2. Spins up a virtual Ubuntu machine
3. Connects to your server via SSH
4. Pulls latest code
5. Rebuilds API and Frontend
6. Restarts PM2 processes
7. Runs health check — if failed, rolls back!

### Setting up Secrets:
Go to: `GitHub repo → Settings → Secrets and variables → Actions`

Add these 3 secrets:
| Secret Name | Value |
|-------------|-------|
| `SERVER_HOST` | `43.204.64.81` |
| `SERVER_USER` | `ubuntu` |
| `SERVER_SSH_KEY` | Full content of `cl_dev.pem` file |

### Understanding the Workflow File:
```yaml
on:
  push:
    branches: [main]    # Trigger: when main branch gets new code
  workflow_dispatch:    # Also allows manual trigger from GitHub UI

jobs:
  lint:                 # Job 1: Check code quality
    ...
  
  deploy:              # Job 2: Deploy to server
    needs: lint        # Only run if lint passes
    steps:
      - Setup SSH      # Create SSH key file
      - Deploy         # SSH into server, run deployment commands
      - Health Check   # Verify app is working
      - Rollback       # If failed, revert to previous version
```

### After Setup:
```bash
# Any code change:
git add .
git commit -m "fix: some bug"
git push origin main
# GitHub automatically deploys to server! No manual SSH needed.
```

---

## 9. What's Pending

### Must Do (Before Public Access):
1. **Open Ports in AWS Security Group**
   - Port 3000 (Frontend)
   - Port 4000 (API)
   - Ask server owner to add these inbound rules

2. **Google OAuth Redirect URL**
   - Go to: console.cloud.google.com → APIs & Services → Credentials
   - Add to "Authorized redirect URIs":
     ```
     http://43.204.64.81:3000/api/auth/callback/google
     ```
   - Add to "Authorized JavaScript origins":
     ```
     http://43.204.64.81:3000
     ```

### Optional (For Production):
3. **Real SMS OTP (instead of dev mode)**
   - Option A: AWS SNS (complex in India — needs DLT registration)
   - Option B: Fast2SMS (easy, built for India, free credits)

4. **Domain Name**
   - Buy domain: `consultlegal.in` from GoDaddy/Namecheap (~₹800/year)
   - Point DNS A record to `43.204.64.81`
   - Setup Nginx as reverse proxy
   - Install SSL certificate (free via Let's Encrypt/Certbot)

5. **Replace Personal Google OAuth with Company's**
   - Create Google Cloud project under company account
   - Generate new OAuth credentials
   - Update `.env` on server

---

## 10. Quick Reference — All Commands

### Local Development (Your Laptop)
```bash
# Start databases
docker compose -f docker-compose.dev.yml up -d

# Stop databases
docker compose -f docker-compose.dev.yml down

# Start API (from apps/api folder)
npm run start:dev

# Start Frontend
npm run dev

# See all running containers
docker ps
```

### SSH to Server
```bash
# Connect (Git Bash)
ssh -i /d/consultlegal-fullstack/cl_dev.pem ubuntu@43.204.64.81

# Or with config shortcut
ssh cl_dev
```

### On Server — App Management
```bash
# See all running processes
pm2 list

# See API logs (live)
pm2 logs consultlegal-api

# See Frontend logs (live)
pm2 logs consultlegal-web

# See last 50 lines (no live follow)
pm2 logs consultlegal-api --lines 50 --nostream

# Restart API
pm2 restart consultlegal-api

# Restart Frontend
pm2 restart consultlegal-web

# Restart everything
pm2 restart all

# Stop everything
pm2 stop all
```

### On Server — Database Management
```bash
# See running databases
docker ps

# Stop databases
docker compose -f docker-compose.dev.yml down

# Start databases
docker compose -f docker-compose.dev.yml up -d

# See database logs
docker logs consultlegal-postgres
docker logs consultlegal-mongo
docker logs consultlegal-redis
```

### On Server — Manual Re-deployment
```bash
cd /home/ubuntu/consultlegal

# Pull latest code
git pull origin main

# Rebuild API
npm install --prefix apps/api
cd apps/api && npm run build && cd ~/consultlegal

# Rebuild Frontend
npm install
npm run build

# Restart
pm2 restart consultlegal-api
pm2 restart consultlegal-web
pm2 save
```

### Git (Laptop)
```bash
# Check what changed
git status

# Stage all changes
git add -A
# OR stage specific file
git add filename.ts

# Commit with message
git commit -m "feat: description of what you did"

# Push to GitHub (triggers auto-deploy)
git push origin main

# See commit history
git log --oneline -10
```

---

## 11. Troubleshooting

### ❌ SSH Connection Timeout
**Cause:** AWS Security Group blocking port 22 for your IP  
**Fix:** Check AWS Console → EC2 → Security Groups → Inbound rules → Port 22 must allow your IP

### ❌ App not accessible on browser
**Cause:** Ports 3000/4000 not open in Security Group  
**Fix:** Add inbound rules for ports 3000 and 4000 with source `0.0.0.0/0`

### ❌ API crashes on startup
**Check logs:**
```bash
pm2 logs consultlegal-api --lines 50 --nostream
```
**Common cause:** .env file missing or wrong path  
**Fix:** Ensure PM2 is started with correct `--cwd` pointing to `apps/api`

### ❌ Database connection failed
**Check:**
```bash
docker ps  # Are containers running?
docker logs consultlegal-postgres
```
**Fix:**
```bash
docker compose -f docker-compose.dev.yml up -d
```

### ❌ Google Login not working
**Cause:** Redirect URI not added in Google Console  
**Fix:** Add `http://43.204.64.81:3000/api/auth/callback/google` to authorized redirect URIs

### ❌ npm install fails
**Cause:** Usually network or permissions issue  
**Fix:**
```bash
npm cache clean --force
npm install
```

### ❌ Build fails
**Check error carefully:**
- TypeScript errors → fix the code
- Missing env variable → add to .env
- Out of memory → server might not have enough RAM for build

---

## 📊 Cost Breakdown (Approximate)

| Service | Cost |
|---------|------|
| AWS EC2 Server | Depends on plan (t3.micro ~₹600/month) |
| Domain name | ~₹800/year |
| Fast2SMS OTP | ~₹0.15 per SMS |
| Google OAuth | Free |
| GitHub Actions | Free (public repo) |
| SSL Certificate | Free (Let's Encrypt) |

---

## 🎓 Concepts Learned Today

| Concept | What it means |
|---------|--------------|
| **SSH** | Remotely control a server from your terminal |
| **PEM key** | Cryptographic key file — replaces password for server access |
| **Security Group** | AWS firewall — controls what traffic reaches your server |
| **Port** | A numbered "door" on a server — each service uses a specific one |
| **Docker** | Run apps in isolated containers — databases made easy |
| **PM2** | Keep Node.js apps alive and restart them if they crash |
| **CI/CD** | Automate code testing and deployment via GitHub Actions |
| **Reverse Proxy** | Nginx sits in front and routes traffic to right service |
| **SSL/HTTPS** | Encrypted connection — padlock in browser |
| **Environment Variables** | Configuration stored outside code — secrets/settings |
| **Prisma** | ORM — interact with PostgreSQL using TypeScript instead of SQL |
| **ARM64** | Processor architecture (Apple M1 style) — AWS Graviton servers use this |

---

*Last updated: 29 July 2026*  
*Deployed by: Vineet Yadav*  
*App: ConsultLegal — AI-Powered Legal Document Platform*  
*Server: AWS EC2 — 43.204.64.81 (ap-south-1)*
