# 🎯 MockMate.AI — AI Career Preparation SaaS Platform

> **MockMate.AI** is a full-stack, AI-powered career preparation platform designed to help candidates land their dream jobs. It combines voice-driven mock interviews, ATS resume optimization, LinkedIn profile audits, job application tracking, and an intelligent AI career coach — all in one premium SaaS workspace.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| **🎤 AI Mock Interview Simulator** | Conduct voice-driven, role-specific mock interviews (Technical, Behavioral, System Design, HR). Speech recognition via Web Speech API. Filler-word detection (um, uh, like…). Scored per answer by Gemini AI. |
| **📄 Resume ATS Analyzer** | Upload PDF/DOCX resume → get ATS score, formatting issues, missing keywords, and Before/After bullet point rewrites. |
| **🔗 LinkedIn Profile Optimizer** | Paste LinkedIn profile text → receive 3 AI-crafted headlines, a revamped About section, and per-experience improvement tips. |
| **📋 Job Application Tracker** | Kanban-style pipeline board to manage all job applications across stages: Saved → Applied → Interview → Offer → Rejected. |
| **🤖 AI Career Coach Chat** | Personalized AI coaching chat. Context-enriched from your latest resume audit. Supports preset prompts for common career questions. |
| **📊 Analytics Dashboard** | XP progression, level badges, interview score radar, ATS history, and job funnel stats. |
| **👤 Profile Management** | Manage name, avatar, saved inputs, generated reports, and account deletion. |
| **⚙️ Admin Panel** | System health, CPU/memory metrics, live API request logs, and SaaS KPIs (users, MRR, uptime). |
| **🔐 JWT Authentication** | Secure cookie-based JWT auth with bcrypt password hashing and token blacklisting on logout. |
| **📦 Subscription System** | FREE (3 sessions/month) and PRO (unlimited) tiers with modular billing-ready controller. |
| **📈 Gamification** | XP awards for each completed interview answer (+50 XP) and full session (+200 XP). Auto-level-up with badge rewards. |
| **ATS Strategy Report** | (Legacy) Original ATS match score, skill gap analysis, tech/behavioral questions, day-by-day roadmap, and PDF resume generator. |

---

## 🏗️ Project Structure

```
ai-ats-platform/
├── Backend/                          # Express.js REST API
│   ├── src/
│   │   ├── controllers/              # Route handler logic
│   │   │   ├── auth.controller.js
│   │   │   ├── mockInterview.controller.js   # Voice mock interview engine
│   │   │   ├── resume.controller.js          # ATS + LinkedIn analysis
│   │   │   ├── jobTracker.controller.js      # Job pipeline CRUD
│   │   │   ├── analytics.controller.js       # XP/badges/stats aggregation
│   │   │   ├── assistant.controller.js       # Career coach chat
│   │   │   ├── subscription.controller.js    # Tier management
│   │   │   └── interview.controller.js       # Legacy ATS strategy
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── mockInterviewSession.model.js
│   │   │   ├── resumeReport.model.js
│   │   │   ├── linkedinReport.model.js
│   │   │   ├── jobApplication.model.js
│   │   │   ├── userProgress.model.js
│   │   │   ├── notification.model.js
│   │   │   ├── subscription.model.js
│   │   │   └── interviewReport.model.js
│   │   ├── routes/                   # Express route definitions
│   │   ├── services/
│   │   │   ├── gemini.services.js    # Unified Gemini AI service (Zod structured schemas)
│   │   │   ├── ai.services.js        # Legacy AI service
│   │   │   └── mail.services.js      # Nodemailer notifications
│   │   ├── middlewares/              # Auth, rate limiter, validation
│   │   └── app.js                    # Express app configuration
│   └── server.js                     # Entry point
│
└── client/                           # Next.js 16 App Router frontend
    ├── app/
    │   ├── page.js                   # Landing page + logged-in dashboard
    │   ├── mock-interview/           # Mock interview flow
    │   │   ├── page.js              # Session configuration form
    │   │   ├── session/[id]/page.js # Active voice interview simulator
    │   │   └── result/[id]/page.js  # Scorecard & feedback report
    │   ├── resume-analyzer/page.js   # ATS audit + before/after bullets
    │   ├── linkedin-analyzer/page.js # LinkedIn optimization dashboard
    │   ├── applications/page.js      # Job tracker kanban board
    │   ├── assistant/page.js         # AI career coach chat
    │   ├── admin/page.js             # Admin health & metrics panel
    │   ├── profile/page.js           # User account management
    │   ├── interview/[id]/page.js    # Legacy ATS strategy report
    │   ├── login/ register/ about/ contact/ help/ privacy/ terms/
    │   └── globals.css               # Premium dark theme design system
    ├── components/
    │   ├── Navbar.jsx                # Responsive navbar with Tools dropdown
    │   ├── Protected.jsx             # Auth-guard HOC
    │   └── ToastContext.jsx
    ├── services/
    │   ├── saas.api.js               # All SaaS feature API calls (Axios)
    │   ├── auth.api.js               # Auth service
    │   └── interview.api.js          # Legacy interview service
    ├── hooks/
    │   ├── useAuth.js
    │   └── useInterview.js
    └── contexts/
        └── ToastContext.js
```

---

## 🧰 Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| AI Engine | Google Gemini AI (`gemini-2.5-flash`) |
| Schema Validation | Zod + `zod-to-json-schema` |
| Auth | JWT (HTTP-only cookies) + bcryptjs |
| File Parsing | Multer + pdf-parse |
| PDF Generation | Puppeteer |
| Security | Helmet, express-rate-limit, HTTPS redirect |
| Email | Nodemailer |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Vanilla CSS |
| HTTP Client | Axios |
| Speech | Web Speech API (`SpeechRecognition`) |
| Fonts | Google Fonts (Inter) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- Google Gemini API Key

### Backend Setup

```bash
cd Backend
npm install
```

Create `.env`:
```env
MONGO_URI=mongodb://localhost:27017/mockmate
JWT_SECRET=your_jwt_secret_here
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

```bash
npm run dev    # Development server on http://localhost:3001
npm run build  # Production build
```

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT cookie |
| POST | `/api/auth/logout` | Blacklist token & clear cookie |
| GET | `/api/auth/me` | Get current user |

### Mock Interview
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/mock-interview/start` | Start session (role, level, type) |
| POST | `/api/mock-interview/answer` | Submit answer, get next question |
| GET | `/api/mock-interview/result/:id` | Fetch session result & scorecard |

### Resume & LinkedIn
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resume/analyze` | Upload PDF → ATS audit |
| POST | `/api/resume/linkedin` | Text input → LinkedIn optimization |

### Job Tracker
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/job-applications` | List all applications |
| POST | `/api/job-applications` | Create new application |
| PUT | `/api/job-applications/:id` | Update status/notes |
| DELETE | `/api/job-applications/:id` | Delete application |

### Analytics & Subscription
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics` | XP, badges, interview scores, job stats |
| GET | `/api/subscription` | Current subscription tier |
| POST | `/api/subscription/upgrade` | Upgrade plan |

### Career Coach
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/assistant/chat` | Chat with AI career coach |

---

## 🤖 AI Architecture

All AI calls route through the unified `gemini.services.js` wrapper which enforces **Zod structured response schemas** via `responseMimeType: "application/json"` + `responseSchema`. This guarantees consistent, parseable JSON from every Gemini response:

- `generateMockQuestion()` — adaptive follow-up questions
- `evaluateAnswer()` — score (0-100) + constructive feedback
- `generateSessionSummary()` — overall score + detailed report
- `analyzeResume()` — ATS score, keywords, before/after bullets
- `analyzeLinkedIn()` — headlines, about section, experience tips
- `chatCareerAssistant()` — context-aware career coaching
- `generateAdaptiveRoadmap()` — week-by-week learning plan

---

## 🔒 Security

- All protected routes use `verifyJWT` middleware (cookie-based)
- Rate limiting: 100 requests / 15 min per IP
- Helmet security headers on all responses
- Token blacklisting on logout via `blacklist.model.js`
- HTTPS redirect enforced in production
- SaaS tier limits enforced at controller level (3 free mock sessions/month)

---

## 🎨 Design System

The premium dark theme is defined in `client/app/globals.css`:

- **Background**: `#0a0a0c` deep dark
- **Primary accent**: `#00f5a0` (teal-green) with gradient to `#00b4d8`
- **Glass panels**: `rgba(255,255,255,0.03)` + `backdrop-filter: blur`
- **Typography**: Inter (Google Fonts), weights 400–800
- **Micro-animations**: fade-in, slide-up, pulse, shimmer loading skeletons
- **Components**: `.interview-card`, `.generate-btn`, `.spinner`, `.global-navbar`

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

*Built with ❤️ using Next.js, Express, MongoDB, and Google Gemini AI*
