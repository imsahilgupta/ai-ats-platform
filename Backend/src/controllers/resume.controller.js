const resumeReportModel = require("../models/resumeReport.model");
const linkedinReportModel = require("../models/linkedinReport.model");
const geminiService = require("../services/gemini.services");
const pdfParse = require("pdf-parse");

/**
 * Perform detailed ATS analysis on uploaded resume
 */
async function analyzeResumeController(req, res) {
    try {
        let resumeText = "";
        if (req.file) {
            const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            resumeText = (typeof parsed === 'string' ? parsed : parsed?.text) || "";
        } else {
            resumeText = req.body.resumeText || "";
        }

        const { jobDescription } = req.body;
        if (!resumeText || !jobDescription) {
            return res.status(400).json({ message: "Resume content and target job description are required." });
        }

        const reportData = await geminiService.analyzeResume({
            resumeText,
            jobDescription
        });

        const report = await resumeReportModel.create({
            user: req.user.id,
            atsScore: reportData.atsScore || 0,
            formattingProblems: reportData.formattingProblems || [],
            missingKeywords: reportData.missingKeywords || [],
            weakBulletPoints: reportData.weakBulletPoints || [],
            experienceQualityReport: reportData.experienceQualityReport || ""
        });

        res.status(200).json({
            message: "Resume analyzed successfully.",
            report
        });
    } catch (error) {
        console.error("Resume analysis error:", error);
        res.status(500).json({ message: "Failed to analyze resume.", error: error.message });
    }
}

/**
 * Perform detailed LinkedIn copy auditing
 */
async function analyzeLinkedinController(req, res) {
    try {
        const { profileText } = req.body;
        if (!profileText) {
            return res.status(400).json({ message: "LinkedIn profile text is required." });
        }

        const suggestions = await geminiService.analyzeLinkedIn({ profileText });

        const report = await linkedinReportModel.create({
            user: req.user.id,
            headlineSuggestions: suggestions.headlineSuggestions || [],
            aboutSuggestions: suggestions.aboutSuggestions || "",
            experienceSuggestions: suggestions.experienceSuggestions || []
        });

        res.status(200).json({
            message: "LinkedIn profile optimized successfully.",
            report
        });
    } catch (error) {
        console.error("LinkedIn analysis error:", error);
        res.status(500).json({ message: "Failed to optimize LinkedIn profile.", error: error.message });
    }
}

module.exports = {
    analyzeResumeController,
    analyzeLinkedinController
};
