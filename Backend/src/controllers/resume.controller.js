const resumeReportModel = require("../models/resumeReport.model");
const userModel = require("../models/user.model");
const geminiService = require("../services/gemini.services");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { getUsageWindowState } = require("../utils/usageLimits");
const { sendResumeAnalysisCompletedEmail } = require("../services/mail.services");

/**
 * Perform detailed ATS analysis on uploaded resume
 */
async function analyzeResumeController(req, res) {
  try {
    let resumeText = "";
    let sourceType = "text";

    if (req.file) {
      const fileName = req.file.originalname || "";
      const extension = fileName.split(".").pop()?.toLowerCase();
      if (extension === "docx") {
        const parsed = await mammoth.extractRawText({
          buffer: req.file.buffer,
        });
        resumeText = parsed.value || "";
        sourceType = "docx";
      } else {
        const parsed = await new pdfParse.PDFParse(
          Uint8Array.from(req.file.buffer),
        ).getText();
        resumeText = (typeof parsed === "string" ? parsed : parsed?.text) || "";
        sourceType = "pdf";
      }
    } else {
      resumeText = req.body.resumeText || "";
    }

    const { jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res
        .status(400)
        .json({
          message: "Resume content and target job description are required.",
        });
    }

    const reportData = await geminiService.analyzeResume({
      resumeText,
      jobDescription,
    });

    const existingReports = await resumeReportModel.countDocuments({
      user: req.user.id,
    });
    const report = await resumeReportModel.create({
      user: req.user.id,
      atsScore: reportData.atsScore || 0,
      formattingProblems: reportData.formattingProblems || [],
      missingKeywords: reportData.missingKeywords || [],
      weakBulletPoints: reportData.weakBulletPoints || [],
      experienceQualityReport: reportData.experienceQualityReport || "",
      versionLabel: `v${existingReports + 1}`,
      sourceType,
    });

    const user = await userModel.findById(req.user.id);
    if (user) {
      sendResumeAnalysisCompletedEmail(user.email, {
        atsScore: report.atsScore,
        versionLabel: report.versionLabel,
      }).catch((err) => console.error("Failed to send resume analysis email:", err));
    }

    res.status(200).json({
      message: "Resume analyzed successfully.",
      report,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    res
      .status(500)
      .json({ message: "Failed to analyze resume.", error: error.message });
  }
}

async function getResumeHistoryController(req, res) {
  try {
    const reports = await resumeReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.status(200).json({ reports });
  } catch (error) {
    console.error("Resume history error:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch resume history.",
        error: error.message,
      });
  }
}

module.exports = {
  analyzeResumeController,
  getResumeHistoryController,
};
