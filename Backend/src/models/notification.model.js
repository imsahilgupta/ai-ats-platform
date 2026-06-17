const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    type: {
        type: String,
        enum: ["reminder", "system", "interview"],
        default: "system"
    },
    message: {
        type: String,
        required: true
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    scheduledFor: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports = notificationModel;
