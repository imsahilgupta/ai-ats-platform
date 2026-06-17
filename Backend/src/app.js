const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Security Middleware: Helmet for security headers
app.use(helmet());

// Enforce HTTPS in production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    !req.secure &&
    req.get("x-forwarded-proto") !== "https"
  ) {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://mockmate-ats.vercel.app",
      "https://mockmate-backend-puce.vercel.app",
    ],
    credentials: true,
  }),
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/* require all routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* using all routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
