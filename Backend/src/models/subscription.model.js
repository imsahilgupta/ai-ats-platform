const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ["FREE", "PRO", "ENTERPRISE"],
      default: "FREE",
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null },
    mockInterviewUsageCount: { type: Number, default: 0 },
    mockInterviewUsageResetAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const subscriptionModel = mongoose.model("Subscription", subscriptionSchema);

module.exports = subscriptionModel;
