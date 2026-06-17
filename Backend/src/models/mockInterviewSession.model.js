const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["interviewer", "candidate"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    evaluation: {
        score: { type: Number, default: null },
        feedback: { type: String, default: null }
    }
}, { _id: false });

const mockInterviewSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    role: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    interviewType: {
        type: String,
        enum: ["technical", "behavioral", "system-design", "hr"],
        required: true
    },
    questions: [{ type: String }],
    answers: [{ type: String }],
    chatHistory: [chatMessageSchema],
    status: {
        type: String,
        enum: ["ongoing", "completed"],
        default: "ongoing"
    },
    communicationScore: {
        confidence: { type: Number, default: 0 },
        clarity: { type: Number, default: 0 },
        fillerWordsCount: { type: Number, default: 0 },
        pace: { type: String, default: "good" }
    },
    overallScore: { type: Number, default: 0 },
    feedbackReport: { type: String, default: "" }
}, {
    timestamps: true
});

const mockInterviewSessionModel = mongoose.model("MockInterviewSession", mockInterviewSessionSchema);

module.exports = mockInterviewSessionModel;
