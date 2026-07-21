const mockInterviewSessionModel = require("../models/mockInterviewSession.model");
const userProgressModel = require("../models/userProgress.model");
const resumeReportModel = require("../models/resumeReport.model");

async function getAnalyticsController(req, res) {
  try {
    const userId = req.user.id;

    // Fetch User Progress
    let progress = await userProgressModel.findOne({ user: userId });
    if (!progress) {
      progress = await userProgressModel.create({
        user: userId,
        xp: 0,
        level: 1,
      });
    }

    // Fetch Mock Interview Sessions
    const sessions = await mockInterviewSessionModel.find({
      user: userId,
      status: "completed",
    });
    const interviewCount = sessions.length;

    let avgTechnical = 0;
    let avgBehavioral = 0;
    let avgHR = 0;
    let avgOverall = 0;

    let techCount = 0;
    let behavCount = 0;
    let hrCount = 0;

    sessions.forEach((session) => {
      avgOverall += session.overallScore;
      if (
        session.interviewType === "technical" ||
        session.interviewType === "system-design"
      ) {
        avgTechnical += session.overallScore;
        techCount++;
      } else if (session.interviewType === "behavioral") {
        avgBehavioral += session.overallScore;
        behavCount++;
      } else if (session.interviewType === "hr") {
        avgHR += session.overallScore;
        hrCount++;
      }
    });

    avgOverall =
      interviewCount > 0 ? Math.round(avgOverall / interviewCount) : 0;
    avgTechnical = techCount > 0 ? Math.round(avgTechnical / techCount) : 0;
    avgBehavioral = behavCount > 0 ? Math.round(avgBehavioral / behavCount) : 0;
    avgHR = hrCount > 0 ? Math.round(avgHR / hrCount) : 0;

    // Fetch Resume Reports
    const resumes = await resumeReportModel
      .find({ user: userId })
      .sort({ createdAt: -1 });
    const latestResumeScore = resumes.length > 0 ? resumes[0].atsScore : 0;

    res.status(200).json({
      level: progress.level,
      xp: progress.xp,
      badges: progress.badges,
      interviewPerformance: {
        technical: avgTechnical || 75,
        behavioral: avgBehavioral || 70,
        hr: avgHR || 80,
        overall: avgOverall || 75,
      },
      latestResumeScore,
      sessionsHistory: sessions.map((s) => ({
        id: s._id,
        role: s.role,
        type: s.interviewType,
        score: s.overallScore,
        date: s.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res
      .status(500)
      .json({ message: "Failed to compile analytics.", error: error.message });
  }
}

/**
 * Admin-only: platform-wide system stats
 */
async function getAdminStatsController(req, res) {
  try {
    const userModel = require("../models/user.model");
    const subscriptionModel = require("../models/subscription.model");

    const [totalUsers, totalSessions, totalResumes, proSubs] =
      await Promise.all([
        userModel.countDocuments(),
        mockInterviewSessionModel.countDocuments(),
        resumeReportModel.countDocuments(),
        subscriptionModel.countDocuments({
          plan: { $ne: "FREE" },
          isActive: true,
        }),
      ]);

    res.status(200).json({
      totalUsers,
      totalSessions,
      totalResumes,
      activeSubscribers: proSubs,
      monthlyRecurringRevenue: proSubs * 15,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res
      .status(500)
      .json({
        message: "Failed to compile admin stats.",
        error: error.message,
      });
  }
}

/**
 * Public: platform-wide counts safe to show on the marketing site.
 * No auth required — only aggregate counts, no per-user data.
 */
async function getPublicStatsController(req, res) {
  try {
    const userModel = require("../models/user.model");
    const interviewReportModel = require("../models/interviewReport.model");

    const [totalUsers, completedMockInterviews, totalResumes, careerReports] =
      await Promise.all([
        userModel.countDocuments(),
        mockInterviewSessionModel.countDocuments({ status: "completed" }),
        resumeReportModel.countDocuments(),
        interviewReportModel.countDocuments(),
      ]);

    res.status(200).json({
      totalUsers,
      completedMockInterviews,
      totalResumes,
      careerReports,
    });
  } catch (error) {
    console.error("Public stats error:", error);
    res
      .status(500)
      .json({
        message: "Failed to compile public stats.",
        error: error.message,
      });
  }
}

module.exports = {
  getAnalyticsController,
  getAdminStatsController,
  getPublicStatsController,
};
