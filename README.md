<div align="center">

# ⚖️ ConsultLegal

### AI-Powered Legal Document Platform

**Automate legal document generation, connect with verified lawyers, and get instant AI legal advice — built for Indian businesses.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[Live Demo](#) · [Report Bug](https://github.com/Vineet-SimtelAI/Vineet-Simtel-Consult-Legal-AI/issues) · [Request Feature](https://github.com/Vineet-SimtelAI/Vineet-Simtel-Consult-Legal-AI/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Running with Docker](#running-with-docker-recommended)
  - [Running Locally](#running-locally-manual)
- [Pages & Routes](#-pages--routes)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🏛️ About the Project

**ConsultLegal** is a full-stack SaaS legal-tech platform built for Indian businesses. It combines AI-powered document generation, a verified lawyer marketplace, and an intelligent legal chat assistant — all under one roof.

The platform is designed to democratize access to legal services by making it fast, affordable, and intelligent to:
- Generate court-ready legal documents in minutes
- Find and consult verified lawyers across practice areas
- Get instant answers to legal questions via AI chat
- Manage all legal work from a unified dashboard

---

## ✨ Features

### For Businesses
- 📄 **AI Document Generation** — Create NDAs, Employment Agreements, Service Contracts, MOUs and more with AI assistance
- 🤖 **AI Legal Chat** — Context-aware legal Q&A powered by advanced AI models
- 👨‍⚖️ **Lawyer Marketplace** — Browse and book verified lawyers by practice area and location
- 💳 **Credit System** — Flexible pay-per-use credit model (₹10+ per token)
- 📊 **Dashboard** — Manage documents, consultations, chat history, and credits in one place

### Platform
- 🔐 **Secure Auth** — JWT + Google OAuth with NextAuth.js
- 📱 **Fully Responsive** — Mobile-first design
- 🌙 **Dark Mode** — Premium black/ivory/gold design system
- 💰 **Razorpay Payments** — Integrated Indian payment gateway
- 📧 **OTP via SMS** — AWS SNS for phone number verification
- ☁️ **File Storage** — MinIO (S3-compatible) for document uploads
- 📊 **Analytics** — Comprehensive admin dashboard

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1 (Turbopack) | React framework with SSR/SSG |
| TypeScript | 5.0 | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| shadcn/ui | Latest | UI component library |
| Framer Motion | Latest | Animations |
| NextAuth.js | 4.x | Authentication |
| React Hook Form | Latest | Form management |
| Zod | Latest | Schema validation |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| NestJS | 10.x | Node.js framework |
| Prisma | 5.x | ORM for PostgreSQL |
| Mongoose | 8.x | ODM for MongoDB |
| Redis (ioredis) | Latest | Caching & sessions |
| Socket.io | Latest | Real-time communication |
| Passport.js | Latest | Auth strategies |
| Bull | Latest | Job queues |
| Winston | Latest | Logging |
| Swagger | Latest | API documentation |

### Infrastructure
| Service | Purpose |
|---------|---------|
| PostgreSQL 15 | Primary relational database (users, documents, payments) |
| MongoDB | Chat history, analytics, flexible document storage |
| Redis | Session cache, OTP storage, job queues |
| MinIO | S3-compatible file storage (document uploads) |
| Docker Compose | Container orchestration for local dev |

### External Services
| Service | Purpose |
|---------|---------|
| OpenAI API | AI document generation & legal chat |
| Razorpay | Payment processing (Indian gateway) |
| AWS SNS | SMS OTP delivery |
| Google OAuth | Social authentication |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│                    Next.js (Port 3000)                       │
│          SSR + Client Components + NextAuth.js               │
└─────────────────────┬───────────────────────────────────────┘
                       │ HTTP / WebSocket
┌─────────────────────▼───────────────────────────────────────┐
│                   NestJS API (Port 4000)                     │
│              /api/v1/* REST + WebSocket Gateway              │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │Documents │  │   Chat   │  │ Lawyers  │   │
│  │ Module   │  │ Module   │  │ Module   │  │ Module   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Credits  │  │Payments  │  │  Users   │  │  Admin   │   │
│  │ Module   │  │ Module   │  │ Module   │  │ Module   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────┬────────────┬───────────────┬──────────────┬──────────┘
       │            │               │              │
┌──────▼───┐  ┌────▼────┐  ┌──────▼──┐  ┌────────▼─┐
│PostgreSQL│  │ MongoDB │  │  Redis  │  │  MinIO   │
│  :5432   │  │  :27017 │  │  :6379  │  │  :9000   │
└──────────┘  └─────────┘  └─────────┘  └──────────┘
```

---

## 📁 Project Structure

```
consultlegal-fullstack/
│
├── src/                          # Next.js Frontend
│   ├── app/                      # App Router pages
│   │   ├── page.tsx              # Landing page (/)
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles + design tokens
│   │   ├── about/                # About page
│   │   ├── contact/              # Contact page
│   │   ├── login/                # Authentication
│   │   ├── documents/            # Document browser
│   │   ├── resources/            # Legal resources
│   │   ├── products/
│   │   │   ├── ai-chat/          # AI Chat product page
│   │   │   ├── documents/        # Document generation product
│   │   │   └── lawyers/          # Lawyer marketplace product
│   │   ├── dashboard/            # Protected dashboard
│   │   │   ├── chat/             # AI Legal Chat
│   │   │   ├── consultations/    # Lawyer bookings
│   │   │   ├── credits/          # Credit management
│   │   │   ├── documents/        # My documents
│   │   │   │   └── generate/     # Generate new document
│   │   │   ├── lawyers/          # Browse lawyers
│   │   │   └── settings/         # Account settings
│   │   ├── terms/                # Terms & Conditions
│   │   ├── privacy/              # Privacy Policy
│   │   ├── payment/              # Payment Policy
│   │   └── refunds/              # Refund Policy
│   │
│   └── components/
│       ├── landing/              # Landing page sections
│       │   ├── hero-section.tsx
│       │   ├── services-section.tsx
│       │   ├── why-choose-section.tsx
│       │   ├── how-it-works-section.tsx
│       │   ├── pricing-section.tsx
│       │   ├── resources-section.tsx
│       │   ├── document-library-section.tsx
│       │   └── cta-section.tsx
│       ├── layout/
│       │   ├── navbar.tsx        # Navigation bar
│       │   └── footer.tsx        # Footer
│       ├── auth/
│       │   └── session-provider.tsx
│       ├── ui/                   # shadcn/ui components (40+)
│       └── theme-provider.tsx
│
├── apps/
│   └── api/                      # NestJS Backend
│       └── src/
│           ├── main.ts           # Entry point (Port 4000)
│           ├── app.module.ts     # Root module
│           ├── core/
│           │   ├── auth/         # JWT + Passport strategies
│           │   ├── storage/      # MinIO file storage service
│           │   └── ...
│           └── modules/
│               ├── admin/        # Admin management
│               ├── auth/         # Authentication & OTP
│               ├── chat/         # AI chat with OpenAI
│               ├── consultations/# Lawyer booking system
│               ├── credits/      # Credit purchase & usage
│               ├── documents/    # Document CRUD & generation
│               ├── lawyers/      # Lawyer profiles & search
│               ├── payments/     # Razorpay integration
│               └── users/        # User profile management
│
├── prisma/
│   └── schema.prisma             # PostgreSQL schema
│
├── public/
│   ├── favicon.png               # ConsultLegal favicon
│   ├── logo.svg                  # Scales of justice icon
│   └── robots.txt
│
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── docker-compose.yml            # Full stack containers
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Design system tokens
├── SETUP.md                      # Quick setup guide
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Bundled with Node.js |
| Docker Desktop | Latest | [docker.com](https://docker.com) |
| Git | Latest | [git-scm.com](https://git-scm.com) |

### Environment Setup

```bash
# 1. Clone the repository
git clone https://github.com/Vineet-SimtelAI/Vineet-Simtel-Consult-Legal-AI.git
cd Vineet-Simtel-Consult-Legal-AI

# 2. Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env

# 3. Edit .env with your values (minimum required shown below)
```

**Minimum required variables for local development:**

```env
# Root .env
DATABASE_URL=postgresql://consultlegal:consultlegal@localhost:5432/consultlegal
MONGODB_URI=mongodb://localhost:27017/consultlegal
REDIS_URL=redis://localhost:6379
NEXTAUTH_SECRET=your-random-secret-32-chars
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your-random-secret-32-chars
AI_API_KEY=your-openai-api-key
AI_MODEL=gpt-4
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

### Running with Docker (Recommended)

The easiest way to run the complete stack:

```bash
# Start all services (databases + API + frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services started:**
| Service | Port | URL |
|---------|------|-----|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| Backend (NestJS) | 4000 | http://localhost:4000/api/v1 |
| API Docs (Swagger) | 4000 | http://localhost:4000/api/docs |
| PostgreSQL | 5432 | localhost:5432 |
| MongoDB | 27017 | localhost:27017 |
| Redis | 6379 | localhost:6379 |
| MinIO Console | 9001 | http://localhost:9001 |

---

### Running Locally (Manual)

**Step 1 — Start databases only:**
```bash
docker-compose up -d postgres mongodb redis minio
```

**Step 2 — Setup the database:**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

**Step 3 — Install dependencies:**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd apps/api && npm install && cd ../..
```

**Step 4 — Start the backend (NestJS):**
```bash
cd apps/api
npm run start:dev
# API available at http://localhost:4000
```

**Step 5 — Start the frontend (Next.js):**
```bash
# In a new terminal, from project root
npm run dev
# App available at http://localhost:3000
```

---

## 📄 Pages & Routes

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — Hero, Services, Pricing, CTA |
| `/about` | About ConsultLegal |
| `/contact` | Contact form & details |
| `/login` | Login / Register |
| `/documents` | Browse document templates |
| `/resources` | Legal resources & guides |
| `/products/documents` | Document generation product page |
| `/products/lawyers` | Lawyer marketplace product page |
| `/products/ai-chat` | AI Legal Chat product page |
| `/terms` | Terms & Conditions |
| `/privacy` | Privacy Policy |
| `/payment` | Payment Policy |
| `/refunds` | Refund Policy |

### Protected Dashboard Routes (Auth Required)

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview & stats |
| `/dashboard/documents` | My generated documents |
| `/dashboard/documents/generate` | Generate new document with AI |
| `/dashboard/chat` | AI Legal Chat interface |
| `/dashboard/lawyers` | Browse & book lawyers |
| `/dashboard/consultations` | My lawyer consultations |
| `/dashboard/credits` | Buy & manage credits |
| `/dashboard/settings` | Account settings & profile |

---

## 🔌 API Reference

Base URL: `http://localhost:4000/api/v1`

Interactive docs: `http://localhost:4000/api/docs` (Swagger UI)

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login with email/password |
| `POST` | `/auth/login/google` | Google OAuth login |
| `POST` | `/auth/send-otp` | Send OTP to phone |
| `POST` | `/auth/verify-otp` | Verify OTP |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/logout` | Logout |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/documents` | List all document templates |
| `GET` | `/documents/:id` | Get document details |
| `POST` | `/documents/generate` | Generate document with AI |
| `GET` | `/documents/my` | Get user's documents |
| `DELETE` | `/documents/:id` | Delete a document |

### AI Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat/message` | Send message to AI |
| `GET` | `/chat/history` | Get chat history |
| `DELETE` | `/chat/history` | Clear chat history |
| `WS` | `/chat` | WebSocket for real-time chat |

### Lawyers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/lawyers` | List lawyers (with filters) |
| `GET` | `/lawyers/:id` | Get lawyer profile |
| `POST` | `/lawyers/book` | Book a consultation |
| `GET` | `/lawyers/specializations` | Get practice areas |

### Credits & Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/credits/balance` | Get credit balance |
| `POST` | `/credits/purchase` | Purchase credits |
| `GET` | `/credits/transactions` | Credit transaction history |
| `POST` | `/payments/create-order` | Create Razorpay order |
| `POST` | `/payments/verify` | Verify payment |
| `POST` | `/payments/webhook` | Razorpay webhook |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/profile` | Get current user profile |
| `PATCH` | `/users/profile` | Update profile |
| `POST` | `/users/upload-avatar` | Upload profile picture |

---

## 🗄️ Database Schema

### PostgreSQL (via Prisma)

```
Users          — id, email, phone, name, role, credits, createdAt
Documents      — id, userId, type, title, content, status, createdAt
Lawyers        — id, name, specializations, experience, location, verified
Consultations  — id, userId, lawyerId, scheduledAt, status, notes
Credits        — id, userId, amount, type, description, createdAt
Payments       — id, userId, orderId, amount, status, razorpayId
```

### MongoDB (via Mongoose)

```
ChatMessages   — sessionId, userId, role, content, tokens, timestamp
Analytics      — event, userId, metadata, timestamp
```

---

## 🔐 Environment Variables

### Root (`/.env`)

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/consultlegal
MONGODB_URI=mongodb://localhost:27017/consultlegal
REDIS_URL=redis://localhost:6379

# Authentication
NEXTAUTH_SECRET=<32-char-random-string>
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=<same-as-NEXTAUTH_SECRET>
AUTH_URL=http://localhost:3000

# Google OAuth (https://console.cloud.google.com)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AWS SNS for OTP
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# MinIO / File Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=consultlegal

# Razorpay Payments (https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# AI Provider
AI_API_KEY=<your-openai-api-key>
AI_MODEL=gpt-4

# API
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Backend (`/apps/api/.env`)

```env
DATABASE_URL=postgresql://consultlegal:consultlegal@localhost:5432/consultlegal
MONGODB_URI=mongodb://localhost:27017/consultlegal
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=<your-jwt-secret>
AI_API_KEY=<your-openai-api-key>
AI_MODEL=gpt-4
AI_BASE_URL=https://api.openai.com/v1
PORT=4000
```

---

## 🌐 Deployment

### Production with Docker

```bash
# Build production images
docker-compose -f docker-compose.yml up -d --build

# The app will be available at http://your-server-ip:3000
```

### Environment for Production

Update these in your `.env`:
```env
NEXTAUTH_URL=https://yourdomain.com
AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

### Recommended Infrastructure

| Component | Recommended Service |
|-----------|-------------------|
| Frontend | Vercel / AWS EC2 |
| Backend API | AWS EC2 / DigitalOcean |
| PostgreSQL | AWS RDS / Supabase |
| MongoDB | MongoDB Atlas |
| Redis | Redis Cloud / Upstash |
| File Storage | AWS S3 / MinIO on VPS |
| CDN | Cloudflare |

---

## 🏢 Company

**ConsultLegal** is a product of **Simulate Intelligence Private Limited**

- 📧 contact@simtel.ai
- 📞 +91 95133 33471
- 📍 Bengaluru, Karnataka, India
- 🏛️ CIN: U62099KA2023PTC177283
- 💼 GST: 29ABLCS4636F2ZY

---

## 📜 License

This project is proprietary software owned by Simulate Intelligence Private Limited.
All rights reserved © 2023-2026.

---

<div align="center">
Built with ❤️ by <a href="https://simtel.ai">Simulate Intelligence</a>
</div>
