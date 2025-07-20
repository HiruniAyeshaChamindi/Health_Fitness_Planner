const mongoose = require("mongoose")

const coachRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    goals: [String], // User's specific goals
    preferredSchedule: String,
    planType: {
      type: String,
      enum: ["session", "weekly", "monthly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    responseMessage: String, // Coach's response
    startDate: Date,
    endDate: Date,
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("CoachRequest", coachRequestSchema)
