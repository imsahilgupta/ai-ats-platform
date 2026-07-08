const mongoose = require("mongoose");

const weakBulletPointSchema = new mongoose.Schema(
  {
    before: { type: String, required: true },
    after: { type: String, required: true },
  },
  { _id: false },
);

const resumeReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    formattingProblems: [{ type: String }],
    missingKeywords: [{ type: String }],
    weakBulletPoints: [weakBulletPointSchema],
    experienceQualityReport: { type: String, default: "" },
    versionLabel: { type: String, default: "v1" },
    sourceType: { type: String, default: "pdf" },
  },
  {
    timestamps: true,
  },
);

const resumeReportModel = mongoose.model("ResumeReport", resumeReportSchema);

module.exports = resumeReportModel;
