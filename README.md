# 🎯 MockMate.AI — AI Career Preparation SaaS Platform

> **MockMate.AI** is a full-stack, AI-powered career preparation platform. It combines AI-driven mock interviews, ATS resume analysis, a personalized career strategy report, gamified progress tracking, and a subscription-gated SaaS experience — backed by an admin panel with real platform data.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| **🎤 AI Mock Interview** | Text-based, role-specific mock interviews (Technical, Behavioral, System Design, HR) — 5 rounds per session, scored per answer and overall by Gemini AI. FREE plan is capped at 3 sessions/month; PRO/ENTERPRISE are unlimited. |
| **📄 Resume ATS Analyzer** | Upload a PDF/DOCX resume (or paste text) → get an ATS score, formatting problems, missing keywords, and before/after bullet-point rewrites. Auto-versioned history (v1, v2, …). |
| **📋 Career Strategy Report** | Upload resume + job description + self-description → get a match score, technical/behavioral questions, skill-gap analysis, and a day-by-day preparation plan. Includes a tailored resume PDF export. |
| **📊 Analytics & Gamification** | XP, levels, badges, interview performance breakdown (technical/behavioral/HR/overall), and resume score trend. |
| **💳 Subscription & Payments** | FREE / PRO / ENTERPRISE tiers. Payment via eSewa (Nepal). |
| **🔔 Notifications** | In-app notification bell for account and subscription events. |
| **👤 Profile** | Photo, skills, education, experience, resume file, social accounts, and account deletion. |
| **🌐 Marketing site** | Landing page, About, Features, Pricing, Contact, Help Center, Blog, and legal pages. |
| **🛠️ Admin Panel** | Real, live data for Users, Subscriptions, Reports, Analytics/Growth, Database, and Server Health (see below). Payments, Support Tickets, Feedback, Announcements, and API Logs are demo/preview data — no backing feature exists for these yet. |
| **🔐 Authentication** | Email/password + Google OAuth. Registration requires a 6-digit emailed verification code before login is allowed. JWT stored in an httpOnly cookie, with token blacklisting on logout. |
| **📧 Email notifications** | Real emails (via Nodemailer) for: registration verification codes, password reset codes, plan upgrades, and completed mock interviews/resume analyses/career reports. Falls back to console logging if SMTP isn't configured. |

---

## 🏗️ Project Structure

```
ai-ats-platform/
├── Backend/                              # Express.js REST API
│   ├── server.js                         # Entry point
│   └── src/
│       ├── app.js                        # Express app + route mounting
│       ├── config/
│       │   └── database.js               # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js         # Register/login/logout, OAuth, account mgmt
│       │   ├── mockInterview.controller.js# Mock interview session engine + usage limits
│       │   ├── resume.controller.js       # Resume ATS analysis
│       │   ├── interview.controller.js    # Career strategy report + PDF export
│       │   ├── analytics.controller.js    # User analytics + admin platform stats
│       │   ├── subscription.controller.js # Plan lookup/upgrade
│       │   ├── payment.controller.js      # eSewa payment flows
│       │   └── admin.controller.js        # Admin-only: users, subscriptions, reports,
│       │                                  #   growth, database stats, system health
│       ├── models/                       # Mongoose schemas (user, subscription,
│       │                                  #   mockInterviewSession, interviewReport,
│       │                                  #   resumeReport, userProgress, notification,
│       │                                  #   blacklist)
│       ├── routes/                       # One router per resource, mounted under /api
│       ├── services/
│       │   ├── gemini.services.js         # Mock interview + resume analysis (Zod schemas)
│       │   ├── ai.services.js             # Career report + PDF generation (Zod schemas)
│       │   └── mail.services.js
│       ├── middlewares/
│       │   ├── auth.middleware.js         # authUser (JWT) + adminOnly
│       │   ├── file.middleware.js         # Multer upload handling
│       │   └── rateLimiter.middleware.js
│       ├── utils/
│       │   ├── usageLimits.js             # FREE-plan monthly usage window logic
│       │   └── validation.js
│       └── scripts/
│           └── seedAdmin.js               # Creates/upgrades an admin account
│
└── client/                                # Next.js 16 App Router frontend (TypeScript)
    ├── app/
    │   ├── (marketing)/                   # Public site: /, about, features, pricing,
    │   │                                  #   contact, help, blog, legal/*
    │   ├── (auth)/                        # login, register, forgot/reset-password
    │   ├── (dashboard)/                   # Authenticated user app: dashboard,
    │   │                                  #   mock-interview, resume-analyzer,
    │   │                                  #   career-report, reports, analytics,
    │   │                                  #   achievements, subscription, notifications,
    │   │                                  #   profile, settings
    │   ├── (admin)/admin/                 # Admin-only panel (see Admin Panel below)
    │   └── layout.tsx                     # Root layout (providers, fonts, theme)
    ├── components/
    │   ├── ui/                            # shadcn/ui primitives (Base UI-based)
    │   ├── shared/                        # Reusable widgets (charts, gauges, badges…)
    │   ├── layout/                        # Sidebars, top nav, user menu
    │   ├── auth/                          # Login/register forms, OAuth buttons
    │   ├── marketing/                     # Landing/marketing page sections
    │   ├── dashboard/                     # Feature-specific dashboard components
    │   └── admin/                         # Admin data table, charts
    ├── lib/
    │   ├── api/                           # Typed fetch wrapper + one module per resource
    │   ├── query/keys.ts                  # TanStack Query key factory
    │   ├── mock/admin.ts                  # Demo-data generators (Payments, Support,
    │   │                                  #   Feedback, Announcements, API Logs only)
    │   └── constants.ts, data/, env.ts, utils.ts
    ├── hooks/                             # React Query hooks per resource
    ├── providers/                         # Query client, auth, theme providers
    ├── types/                             # TypeScript types mirroring backend shapes
    └── proxy.ts                           # Edge-layer route protection (Next 16 middleware)
```

---

## 🧰 Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| AI Engine | Google Gemini AI (`@google/genai`) |
| Schema Validation | Zod + `zod-to-json-schema` |
| Auth | JWT (httpOnly cookies, `sameSite: lax`) + bcryptjs, Google OAuth |
| File Parsing | Multer, `pdf-parse`, `mammoth` (DOCX) |
| PDF Generation | Puppeteer |
| Payments | eSewa (Nepal) integration |
| Security | Helmet, custom in-memory rate limiter (120 req/min per IP) |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React Compiler) |
| Language | TypeScript |
| UI | React 19, shadcn/ui on **Base UI** (not Radix), Tailwind CSS v4 (CSS-first config) |
| Server state | TanStack React Query v5 |
| Forms | react-hook-form + Zod |
| Charts | Recharts (via shadcn's chart wrapper) |
| Theming | `next-themes` (light/dark) |
| Motion | Framer Motion |
| Toasts | Sonner |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- Google Gemini API key

### Backend Setup

```bash
cd Backend
npm install
```

Create `Backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/mockmate
JWT_SECRET=your_jwt_secret_here
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# eSewa (UAT sandbox defaults exist in code if omitted)
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_GATEWAY_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form

# SMTP (email verification, password reset, and result/plan notification emails).
# If omitted, emails are logged to the console instead of sent — nothing crashes,
# but users won't receive real verification/reset codes.
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM="MockMate.AI <no-reply@mockmate.ai>"
```

```bash
npm run dev   # http://localhost:5000
```

### Frontend Setup

```bash
cd client
npm install
```

Create `client/.env.local` (see `client/.env.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev     # http://localhost:3000
npm run build   # Production build
npm run lint
```

### Admin Access

```bash
cd Backend
node src/scripts/seedAdmin.js
```

Creates (or upgrades) an admin account — see `Backend/src/scripts/seedAdmin.js` for the credentials (change them before deploying). Log in at `/login`, then visit `/admin`.

---

## 🔌 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user (unverified — emails a 6-digit code) |
| POST | `/verify-email` | Verify the emailed code, sets JWT cookie |
| POST | `/resend-verification` | Resend the verification code |
| POST | `/forgot-password` | Email a password reset code |
| POST | `/reset-password` | Reset password using the emailed code |
| POST | `/login` | Login, sets JWT cookie (blocked with `403` until verified) |
| GET | `/logout` | Blacklist token & clear cookie |
| GET | `/get-me` | Get current user |
| PATCH | `/update-username` | Change username |
| DELETE | `/delete-account` | Delete account + owned reports |
| GET | `/google`, `/google/callback` | Google OAuth flow |

### Mock Interview (`/api/mock-interview`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/start` | Start a session (role, level, type) — enforces FREE-plan monthly limit |
| POST | `/answer` | Submit an answer, get the next question or final score |
| GET | `/result/:id` | Fetch session result & scorecard |

### Resume & Career Report
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resume/analyze` | Upload/paste resume → ATS audit |
| GET | `/api/resume/history` | Resume analysis version history |
| POST | `/api/interview` | Generate a career strategy report |
| GET | `/api/interview/report/:id` | Fetch a report |
| GET | `/api/interview/` | List reports (lightweight) |
| POST | `/api/interview/resume/pdf/:interviewReportId` | Download a tailored resume PDF |
| DELETE | `/api/interview/report/:id` | Delete a report |

### Analytics, Subscription & Payment
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics` | XP, badges, interview performance, resume score |
| GET | `/api/analytics/admin/stats` | *Admin only* — platform-wide totals |
| GET | `/api/subscription` | Current subscription |
| POST | `/api/subscription/upgrade` | Direct plan set (internal fallback) |
| POST | `/api/payment/esewa/initiate`, `/verify` | eSewa payment flow |

### Admin (`/api/admin`, all admin-only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | All users with plan and join date |
| GET | `/subscriptions` | Active PRO/ENTERPRISE subscriptions |
| GET | `/reports` | Career reports + resume analyses + completed mock interviews |
| GET | `/growth` | 14-day signup growth, active sessions, weekly growth % |
| GET | `/database` | Real MongoDB collection stats |
| GET | `/system` | Real CPU/memory/uptime/DB latency |

---

## 🤖 AI Architecture

Every Gemini call in both service files enforces a **Zod structured response schema** (`responseMimeType: "application/json"` + `responseSchema` via `zod-to-json-schema`), so responses are always consistent, parseable JSON rather than free-form text:

- `services/gemini.services.js` — mock interviews & resume analysis
  - `generateMockQuestion()` — adaptive interview questions
  - `evaluateAnswer()` — per-answer score + feedback
  - `generateSessionSummary()` — overall score + feedback report
  - `analyzeResume()` — ATS score, keywords, before/after bullets
- `services/ai.services.js` — career strategy report
  - `generateInterviewReport()` — match score, skill gaps, preparation plan
  - `generateResumePdf()` + `generatePdfFromHtml()` — tailored resume PDF via Puppeteer

---

## 🔒 Security

- Protected routes use the `authUser` middleware (JWT from an httpOnly cookie); admin routes additionally require `adminOnly`.
- Cookies use `sameSite: "lax"` — deliberately not `"strict"`, since `strict` drops the cookie on cross-site redirects (breaks the eSewa/OAuth return flow).
- Token blacklisting on logout via `blacklist.model.js`.
- Custom in-memory rate limiting (120 req/min per IP) and Helmet security headers on all responses.
- FREE-plan usage limits (3 mock interviews/month) enforced server-side in `mockInterview.controller.js`, mirrored optimistically on the frontend for UX only.

---

## 📄 License

MIT — Free to use, modify, and distribute.
