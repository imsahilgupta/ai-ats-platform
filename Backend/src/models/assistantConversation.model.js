const mongoose = require("mongoose");

const assistantMessageSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const assistantConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    messages: [assistantMessageSchema],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const assistantConversationModel = mongoose.model(
  "AssistantConversation",
  assistantConversationSchema,
);

module.exports = assistantConversationModel;
