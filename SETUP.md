# ConsultLegal - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
# Frontend (Next.js)
npm install

# Backend (NestJS)
cd apps/api
npm install
cd ../..
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your API keys
```

**Minimum required for local dev (all others have fallbacks):**
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Random string for JWT signing
- `AUTH_SECRET` — Same as NEXTAUTH_SECRET

### 3. Start Databases (Docker)
```bash
docker-compose up -d postgres mongodb redis minio
```

### 4. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed with sample data
npx prisma db seed
```

### 5. Start Development Servers
```bash
# Terminal 1: Frontend (Next.js on port 3000)
npm run dev

# Terminal 2: Backend (NestJS on port 4000)
cd apps/api
npm run start:dev
```

### 6. Open in Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/v1
- MinIO Console: http://localhost:9001

---

## Project Structure

```
consultlegal/
├── src/                          # Next.js Frontend
│   ├── app/                      # App Router pages
│   │   ├── page.tsx              # Landing page
│   │   ├── login/                # Login (Phone OTP + Google)
│   │   ├── about/                # About page
│   │   ├── contact/              # Contact form + FAQ
│   │   ├── privacy/              # Privacy Policy
│   │   ├── terms/                # Terms of Service
│   │   ├── refunds/              # Refund Policy
│   │   ├── payment/              # Payment Policy
│   │   ├── resources/            # Legal Resources
│   │   ├── products/
│   │   │   ├── documents/        # AI Documents product page
│   │   │   ├── ai-chat/          # AI Chat product page
│   │   │   └── lawyers/          # Lawyer Marketplace page
│   │   ├── dashboard/            # Protected dashboard
│   │   │   ├── page.tsx          # Overview
│   │   │   ├── documents/        # Document management
│   │   │   ├── chat/             # AI Chat interface
│   │   │   ├── lawyers/          # Lawyer search
│   │   │   ├── consultations/    # Bookings
│   │   │   ├── credits/          # Credit balance
│   │   │   └── settings/         # User settings
│   │   └── api/                  # BFF API routes (proxy to NestJS)
│   │       ├── auth/             # NextAuth + OTP + set-cookie
│   │       ├── users/            # User profile
│   │       ├── documents/        # Document CRUD
│   │       ├── chat/             # Chat conversations
│   │       ├── lawyers/          # Lawyer listing
│   │       ├── consultations/    # Consultation booking
│   │       └── credits/          # Credit management
│   ├── components/               # React components
│   │   ├── ui/                   # 40+ shadcn/ui components
│   │   ├── landing/              # Landing page sections
│   │   ├── layout/               # Navbar, Footer, Sidebar
│   │   ├── dashboard/            # Dashboard components
│   │   ├── chat/                 # Chat components
│   │   └── auth/                 # Session provider
│   ├── stores/                   # Zustand state management
│   └── lib/                      # Utilities, API client
│
├── apps/api/                     # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/             # JWT auth, OTP, Google OAuth
│   │   │   ├── users/           # User CRUD
│   │   │   ├── documents/       # Document generation + queue
│   │   │   ├── chat/            # Socket.io gateway + REST
│   │   │   ├── lawyers/         # Lawyer profiles & search
│   │   │   ├── consultations/   # Booking management
│   │   │   ├── credits/         # Credit system
│   │   │   ├── payments/        # Razorpay integration
│   │   │   └── admin/           # Admin dashboard
│   │   ├── core/                # Prisma, Mongoose, Redis, MinIO, Queue
│   │   └── common/              # Interceptors, filters, guards
│   └── prisma/
│       └── schema.prisma        # 13 PostgreSQL models
│
├── docker-compose.yml            # PostgreSQL, MongoDB, Redis, MinIO
├── .env.example                  # All env vars documented
└── package.json                  # Next.js + scripts
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS, shadcn/ui |
| Animations | Framer Motion, React Three Fiber |
| State | Zustand (persisted) |
| Auth | NextAuth v5 (JWT), Google OAuth, Phone OTP |
| Backend | NestJS 11 |
| Database | PostgreSQL (Prisma), MongoDB (Mongoose), Redis (ioredis) |
| Storage | MinIO (S3-compatible) |
| Payments | Razorpay |
| OTP | AWS SNS |
| AI | OpenAI GPT-4 |
| Real-time | Socket.io |
| Queue | Bull (Redis-backed) |

## Production Deployment

```bash
# Build frontend
npm run build

# Build backend
cd apps/api && npm run build

# Start production
npm run start              # Next.js on port 3000
cd apps/api && npm run start:prod  # NestJS on port 4000
```

## Demo Mode

Without real API keys, the app runs in **demo mode**:
- Login page shows "Try Demo Account" button
- Clicking it logs you in with a demo user (100 credits)
- Dashboard pages are fully navigable with mock data
- Google OAuth button falls back to demo login
- When you add real API keys, everything auto-switches to production mode
