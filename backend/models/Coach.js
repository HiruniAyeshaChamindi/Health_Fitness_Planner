const mongoose = require("mongoose")

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true,
  },
  timeSlots: [
    {
      start: String, // "09:00"
      end: String, // "17:00"
    },
  ],
})

const coachSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
      maxlength: 500,
    },
    specialties: [
      {
        type: String,
        enum: [
          "Weight Loss",
          "Muscle Gain",
          "Yoga",
          "Cardio",
          "Strength Training",
          "Nutrition",
          "Mental Health",
          "Rehabilitation",
        ],
      },
    ],
    certifications: [String],
    experienceYears: {
      type: Number,
      required: true,
      min: 0,
    },
    languages: [String],
    availability: [availabilitySchema],
    profilePic: String,
    verified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    pricing: {
      sessionRate: Number, // per hour
      monthlyRate: Number, // per month
      currency: {
        type: String,
        default: "USD",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for search functionality
coachSchema.index({ specialties: 1, rating: -1, verified: 1 })

module.exports = mongoose.model("Coach", coachSchema)
