const geminiService = require("../services/gemini.services");
const resumeReportModel = require("../models/resumeReport.model");
const assistantConversationModel = require("../models/assistantConversation.model");

async function chatAssistantController(req, res) {
  try {
    const { message, chatHistory, targetRole } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    // Fetch resume gaps context to enrich assistant context if available
    const latestResume = await resumeReportModel
      .findOne({ user: req.user.id })
      .sort({ createdAt: -1 });
    const recentHistory = await resumeReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);
    const missingSkills = latestResume ? latestResume.missingKeywords : [];

    let conversation = await assistantConversationModel.findOne({
      user: req.user.id,
    });
    if (!conversation) {
      conversation = await assistantConversationModel.create({
        user: req.user.id,
        messages: [],
      });
    }

    const persistedHistory = (conversation.messages || []).map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    const answer = await geminiService.chatCareerAssistant({
      message,
      chatHistory: [...persistedHistory, ...(chatHistory || [])],
      resumeText: latestResume ? "Available in database." : "",
      targetRole: targetRole || "Software Developer",
      skillGaps: missingSkills,
      resumeHistory: recentHistory,
    });

    conversation.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: answer.response },
    );
    conversation.updatedAt = new Date();
    await conversation.save();

    res.status(200).json({
      message: "Chat processed successfully.",
      response: answer.response,
    });
  } catch (error) {
    console.error("Chat assistant error:", error);
    res.status(500).json({
      message: "Failed to query career assistant.",
      error: error.message,
    });
  }
}

module.exports = {
  chatAssistantController,
};
