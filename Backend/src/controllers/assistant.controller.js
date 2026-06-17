const geminiService = require("../services/gemini.services");
const resumeReportModel = require("../models/resumeReport.model");

async function chatAssistantController(req, res) {
    try {
        const { message, chatHistory, targetRole } = req.body;
        
        if (!message) {
            return res.status(400).json({ message: "Message is required." });
        }

        // Fetch resume gaps context to enrich assistant context if available
        const latestResume = await resumeReportModel.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        const missingSkills = latestResume ? latestResume.missingKeywords : [];

        const answer = await geminiService.chatCareerAssistant({
            message,
            chatHistory: chatHistory || [],
            resumeText: latestResume ? "Available in database." : "",
            targetRole: targetRole || "Software Developer",
            skillGaps: missingSkills
        });

        res.status(200).json({
            message: "Chat processed successfully.",
            response: answer.response
        });
    } catch (error) {
        console.error("Chat assistant error:", error);
        res.status(500).json({ message: "Failed to query career assistant.", error: error.message });
    }
}

module.exports = {
    chatAssistantController
};
