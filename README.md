# 🎯 AI ATS Platform

> An AI-powered interview strategy and resume optimization platform that analyzes your profile against any job description, identifies skill gaps, generates custom technical & behavioral questions, and builds you a day-by-day preparation roadmap.

---

## ✨ Features

| Feature | Description |
|---|---|
| **ATS Match Score** | AI-calculated % match between your profile and the target JD |
| **Technical Questions** | Role-specific interview questions with intentions and model answers |
| **Behavioral Questions** | Scenario-based questions tailored to the job's cultural requirements |
| **Skill Gap Analysis** | Highlights missing skills and their severity (high / medium / low) |
| **Day-by-Day Roadmap** | A structured preparation plan to close your skill gaps |
| **PDF Resume Generator** | AI-tailored, ATS-friendly resume rendered to downloadable PDF |

---

## 🏗️ Project Structure

```
ai-ats-platform/
├── Backend/              # Express.js REST API
│   ├── src/
│   │   ├── controllers/  # Route handler logic
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routers
│   │   ├── services/     # AI (Gemini) & PDF generation
│   │   ├── middlewares/  # Auth & file upload
│   │   └── config/       # DB connection
│   └── server.js
│
└── client/               # Next.js 16 App Router frontend
    ├── app/
    │   ├── layout.js         # Root layout (Navbar + Footer)
    │   ├── page.js           # Landing / Dashboard (conditional)
    │   ├── login/
    │   ├── register/
    │   ├── interview/[id]/   # Dynamic report view
    │   ├── privacy/
    │   ├── terms/
    │   └── help/
    ├── components/           # Navbar, Footer, Protected
    ├── contexts/             # Auth & Interview React contexts
    ├── hooks/                # useAuth, useInterview
    └── services/             # Axios API service functions
```

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- Google Gemini AI (`@google/genai`)
- Puppeteer (PDF generation)
- JWT + bcryptjs (authentication)
- Multer + pdf-parse (file upload & extraction)
- Zod + zod-to-json-schema (response schema enforcement)

**Frontend**
- Next.js 16 (App Router)
- React 19
- Axios
- Vanilla CSS (scoped, no overlaps)

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas URI
- Google Gemini API key

---

### 1. Clone the Repository

```bash
git clone https://github.com/imsahilgupta/ai-ats-platform.git
cd ai-ats-platform
```

---

### 2. Configure the Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
npm run dev
# Server runs on http://localhost:3000
```

---

### 3. Configure the Client

```bash
cd client
npm install
```

Start the Next.js dev server:

```bash
npm run dev
# Client runs on http://localhost:3001
```

> **Note:** The client expects the backend to be running on `http://localhost:3000`. Update `client/services/interview.api.js` and `auth.api.js` if you change the backend port.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/logout` | Logout (blacklists token) |
| `GET` | `/api/auth/me` | Get current user |

### Interview Reports
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/interview/` | Generate new interview report |
| `GET` | `/api/interview/` | Get all reports for current user |
| `GET` | `/api/interview/report/:id` | Get single report by ID |
| `POST` | `/api/interview/resume/pdf/:id` | Generate & download resume PDF |

---

## 🔐 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `MONGODB_URI` | `Backend/.env` | MongoDB Atlas connection string |
| `JWT_SECRET` | `Backend/.env` | Secret key for JWT signing |
| `GOOGLE_GENAI_API_KEY` | `Backend/.env` | Google Gemini API key |

> ⚠️ **Never commit `.env` files.** Both `.gitignore` files exclude them.

---

## 📸 Screenshots

> Login / Register → Dashboard → Report View (Technical Questions, Behavioral Questions, Roadmap, Match Score, Skill Gaps, PDF Resume Download)

---

## 📄 License

MIT License — feel free to use, fork, and modify for personal or commercial projects.
