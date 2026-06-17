const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, default: "🏆" },
    description: { type: String, default: "" },
    dateEarned: { type: Date, default: Date.now }
}, { _id: false });

const userProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    badges: [badgeSchema],
    completedTasks: [{ type: String }]
}, {
    timestamps: true
});

const userProgressModel = mongoose.model("UserProgress", userProgressSchema);

module.exports = userProgressModel;
