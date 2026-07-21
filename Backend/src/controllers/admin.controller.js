const os = require("os");
const mongoose = require("mongoose");

const userModel = require("../models/user.model");
const subscriptionModel = require("../models/subscription.model");
const interviewReportModel = require("../models/interviewReport.model");
const resumeReportModel = require("../models/resumeReport.model");
const mockInterviewSessionModel = require("../models/mockInterviewSession.model");

/**
 * Admin-only: list every user with their current plan.
 * User has no `createdAt` field, so we derive a real join date from the
 * ObjectId's embedded creation timestamp instead of fabricating one.
 */
async function getUsersController(req, res) {
  try {
    const [users, subscriptions] = await Promise.all([
      userModel.find().select("username email isAdmin"),
      subscriptionModel.find().select("user plan"),
    ]);

    const planByUser = new Map(subscriptions.map((s) => [s.user.toString(), s.plan]));

    const result = users.map((u) => ({
      id: u._id,
      username: u.username,
      email: u.email,
      isAdmin: u.isAdmin,
      plan: planByUser.get(u._id.toString()) || "FREE",
      joinedAt: u._id.getTimestamp(),
    }));

    res.status(200).json({ users: result });
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ message: "Failed to fetch users.", error: error.message });
  }
}

/**
 * Admin-only: every active PRO/ENTERPRISE subscription, joined with the user.
 */
async function getSubscriptionsController(req, res) {
  try {
    const subscriptions = await subscriptionModel
      .find({ plan: { $ne: "FREE" } })
      .populate("user", "username email")
      .sort({ startDate: -1 });

    const result = subscriptions
      .filter((s) => s.user)
      .map((s) => ({
        id: s._id,
        username: s.user.username,
        email: s.user.email,
        plan: s.plan,
        isActive: s.isActive,
        startDate: s.startDate,
        endDate: s.endDate,
      }));

    res.status(200).json({ subscriptions: result });
  } catch (error) {
    console.error("Admin subscriptions error:", error);
    res.status(500).json({ message: "Failed to fetch subscriptions.", error: error.message });
  }
}

/**
 * Admin-only: career reports, resume analyses, and completed mock interviews
 * across every user, merged into one activity feed.
 */
async function getReportsController(req, res) {
  try {
    const [careerReports, resumeReports, mockSessions] = await Promise.all([
      interviewReportModel.find().populate("user", "username").sort({ createdAt: -1 }).limit(100),
      resumeReportModel.find().populate("user", "username").sort({ createdAt: -1 }).limit(100),
      mockInterviewSessionModel
        .find({ status: "completed" })
        .populate("user", "username")
        .sort({ createdAt: -1 })
        .limit(100),
    ]);

    const reports = [
      ...careerReports.map((r) => ({
        id: r._id,
        type: "career",
        user: r.user?.username || "Deleted user",
        score: r.matchScore ?? 0,
        createdAt: r.createdAt,
      })),
      ...resumeReports.map((r) => ({
        id: r._id,
        type: "resume",
        user: r.user?.username || "Deleted user",
        score: r.atsScore ?? 0,
        createdAt: r.createdAt,
      })),
      ...mockSessions.map((s) => ({
        id: s._id,
        type: "mock-interview",
        user: s.user?.username || "Deleted user",
        score: s.overallScore ?? 0,
        createdAt: s.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Admin reports error:", error);
    res.status(500).json({ message: "Failed to fetch reports.", error: error.message });
  }
}

/**
 * Admin-only: real 14-day cumulative signup growth + activity snapshot.
 * User has no createdAt field, so signups-per-day is derived from each
 * ObjectId's embedded creation timestamp via $toDate.
 */
async function getGrowthController(req, res) {
  try {
    const DAYS = 14;
    // Window is inclusive of today, so it spans (DAYS - 1) days back through today.
    const since = new Date(Date.now() - (DAYS - 1) * 86_400_000);
    since.setHours(0, 0, 0, 0);

    const [totalUsersBeforeWindow, dailySignups, activeSessions, sevenDaysAgoSignups, priorSevenDaysSignups] =
      await Promise.all([
        userModel.countDocuments({ _id: { $lt: mongoose.Types.ObjectId.createFromTime(Math.floor(since.getTime() / 1000)) } }),
        userModel.aggregate([
          {
            $match: { _id: { $gte: mongoose.Types.ObjectId.createFromTime(Math.floor(since.getTime() / 1000)) } },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$_id" } } },
              count: { $sum: 1 },
            },
          },
        ]),
        mockInterviewSessionModel.countDocuments({ status: "ongoing" }),
        userModel.countDocuments({
          _id: { $gte: mongoose.Types.ObjectId.createFromTime(Math.floor((Date.now() - 7 * 86_400_000) / 1000)) },
        }),
        userModel.countDocuments({
          _id: {
            $gte: mongoose.Types.ObjectId.createFromTime(Math.floor((Date.now() - 14 * 86_400_000) / 1000)),
            $lt: mongoose.Types.ObjectId.createFromTime(Math.floor((Date.now() - 7 * 86_400_000) / 1000)),
          },
        }),
      ]);

    const countByDay = new Map(dailySignups.map((d) => [d._id, d.count]));

    let running = totalUsersBeforeWindow;
    const series = Array.from({ length: DAYS }, (_, i) => {
      const day = new Date(since.getTime() + i * 86_400_000);
      const key = day.toISOString().slice(0, 10);
      running += countByDay.get(key) || 0;
      return { date: day.toISOString(), users: running };
    });

    const monthlyGrowthPercent =
      priorSevenDaysSignups > 0
        ? Math.round(((sevenDaysAgoSignups - priorSevenDaysSignups) / priorSevenDaysSignups) * 100)
        : sevenDaysAgoSignups > 0
          ? 100
          : 0;

    res.status(200).json({
      series,
      newSignups7d: sevenDaysAgoSignups,
      activeSessions,
      monthlyGrowthPercent,
    });
  } catch (error) {
    console.error("Admin growth error:", error);
    res.status(500).json({ message: "Failed to compile growth data.", error: error.message });
  }
}

/**
 * Admin-only: real MongoDB collection stats via native introspection.
 */
async function getDatabaseController(req, res) {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const stats = await Promise.all(
      collections.map(async (c) => {
        const coll = db.collection(c.name);
        const [documents, collStatsResult] = await Promise.all([
          coll.estimatedDocumentCount(),
          coll
            .aggregate([{ $collStats: { storageStats: {} } }])
            .toArray()
            .catch(() => null),
        ]);
        const sizeBytes = collStatsResult?.[0]?.storageStats?.size ?? 0;
        return {
          name: c.name,
          documents,
          sizeMb: Math.round((sizeBytes / (1024 * 1024)) * 100) / 100,
        };
      }),
    );

    res.status(200).json({
      status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      collections: stats.sort((a, b) => b.documents - a.documents),
    });
  } catch (error) {
    console.error("Admin database error:", error);
    res.status(500).json({ message: "Failed to fetch database stats.", error: error.message });
  }
}

/**
 * Admin-only: real host process metrics (CPU load, memory, uptime).
 */
async function getSystemController(req, res) {
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const cpuCount = os.cpus().length || 1;
    const [load1] = os.loadavg();
    const cpuLoadPercent = Math.min(100, Math.round((load1 / cpuCount) * 100));

    let dbLatencyMs = null;
    const dbStart = Date.now();
    try {
      await mongoose.connection.db.admin().ping();
      dbLatencyMs = Date.now() - dbStart;
    } catch {
      dbLatencyMs = null;
    }

    res.status(200).json({
      uptimeSeconds: Math.round(process.uptime()),
      cpuLoadPercent,
      memory: {
        usedMb: Math.round(usedMem / (1024 * 1024)),
        totalMb: Math.round(totalMem / (1024 * 1024)),
        percent: Math.round((usedMem / totalMem) * 100),
      },
      nodeVersion: process.version,
      platform: os.platform(),
      env: process.env.NODE_ENV || "development",
      dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      dbLatencyMs,
    });
  } catch (error) {
    console.error("Admin system error:", error);
    res.status(500).json({ message: "Failed to fetch system stats.", error: error.message });
  }
}

module.exports = {
  getUsersController,
  getSubscriptionsController,
  getReportsController,
  getGrowthController,
  getDatabaseController,
  getSystemController,
};
