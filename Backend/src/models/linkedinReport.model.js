const mongoose = require("mongoose");

const experienceSuggestionSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    suggestions: { type: String, required: true }
}, { _id: false });

const linkedinReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    headlineSuggestions: [{ type: String }],
    aboutSuggestions: { type: String, default: "" },
    experienceSuggestions: [experienceSuggestionSchema]
}, {
    timestamps: true
});

const linkedinReportModel = mongoose.model("LinkedinReport", linkedinReportSchema);

module.exports = linkedinReportModel;
