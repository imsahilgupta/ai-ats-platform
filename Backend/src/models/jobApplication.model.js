const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    company: {
        type: String,
        required: [true, "Company name is required"]
    },
    role: {
        type: String,
        required: [true, "Role title is required"]
    },
    jobDescription: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["Saved", "Applied", "Interview", "Offer", "Rejected"],
        default: "Saved",
        required: true
    },
    interviewDate: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const jobApplicationModel = mongoose.model("JobApplication", jobApplicationSchema);

module.exports = jobApplicationModel;
