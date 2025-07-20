const mongoose = require("mongoose")

const coachReviewSchema = new mongoose.Schema(
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
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoachRequest",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      maxlength: 500,
    },
    categories: {
      communication: { type: Number, min: 1, max: 5 },
      expertise: { type: Number, min: 1, max: 5 },
      punctuality: { type: Number, min: 1, max: 5 },
      results: { type: Number, min: 1, max: 5 },
    },
  },
  {
    timestamps: true,
  },
)

// Ensure one review per user per coach request
coachReviewSchema.index({ userId: 1, coachId: 1, requestId: 1 }, { unique: true })

module.exports = mongoose.model("CoachReview", coachReviewSchema)
