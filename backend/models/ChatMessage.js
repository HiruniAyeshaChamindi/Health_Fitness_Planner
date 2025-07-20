const mongoose = require("mongoose")

const chatMessageSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoachRequest",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "workout_plan", "meal_plan", "feedback"],
      default: "text",
    },
    attachments: [
      {
        type: String, // URLs to files/images
        name: String,
      },
    ],
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  {
    timestamps: true,
  },
)

// Index for efficient chat queries
chatMessageSchema.index({ requestId: 1, createdAt: 1 })

module.exports = mongoose.model("ChatMessage", chatMessageSchema)
