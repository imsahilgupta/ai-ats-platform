const resumeReportModel = require("../models/resumeReport.model");
const linkedinReportModel = require("../models/linkedinReport.model");
const geminiService = require("../services/gemini.services");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { getUsageWindowState } = require("../utils/usageLimits");

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

/**
 * Perform detailed LinkedIn copy auditing
 */
async function analyzeLinkedinController(req, res) {
  try {
    const { profileText } = req.body;
    if (!profileText) {
      return res
        .status(400)
        .json({ message: "LinkedIn profile text is required." });
    }

    const suggestions = await geminiService.analyzeLinkedIn({ profileText });

    const report = await linkedinReportModel.create({
      user: req.user.id,
      headlineSuggestions: suggestions.headlineSuggestions || [],
      aboutSuggestions: suggestions.aboutSuggestions || "",
      experienceSuggestions: suggestions.experienceSuggestions || [],
    });

    res.status(200).json({
      message: "LinkedIn profile optimized successfully.",
      report,
    });
  } catch (error) {
    console.error("LinkedIn analysis error:", error);
    res
      .status(500)
      .json({
        message: "Failed to optimize LinkedIn profile.",
        error: error.message,
      });
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
  analyzeLinkedinController,
  getResumeHistoryController,
};
