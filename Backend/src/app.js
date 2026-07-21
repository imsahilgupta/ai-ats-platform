const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Security Middleware: Helmet for security headers
app.use(helmet());

const rateLimiter = require("./middlewares/rateLimiter.middleware");
app.use(rateLimiter);


app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
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
const mockInterviewRouter = require("./routes/mockInterview.routes");
const resumeAnalysisRouter = require("./routes/resumeAnalysis.routes");
const analyticsRouter = require("./routes/analytics.routes");
const subscriptionRouter = require("./routes/subscription.routes");
const paymentRouter = require("./routes/payment.routes");
const adminRouter = require("./routes/admin.routes");

/* using all routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/mock-interview", mockInterviewRouter);
app.use("/api/resume", resumeAnalysisRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
