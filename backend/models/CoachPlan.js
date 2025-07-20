const mongoose = require("mongoose")

const coachPlanSchema = new mongoose.Schema(
  {
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoachRequest",
      required: true,
    },
    planType: {
      type: String,
      enum: ["workout", "meal", "combined"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    workoutPlan: {
      exercises: [
        {
          name: String,
          sets: Number,
          reps: String,
          weight: String,
          duration: String,
          notes: String,
        },
      ],
      duration: String, // "45 minutes"
      frequency: String, // "3 times per week"
    },
    mealPlan: {
      meals: [
        {
          type: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"] },
          name: String,
          ingredients: [String],
          calories: Number,
          macros: {
            protein: Number,
            carbs: Number,
            fat: Number,
          },
          instructions: String,
        },
      ],
      dailyCalories: Number,
      notes: String,
    },
    goals: [String],
    duration: String, // "4 weeks"
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
    feedback: [
      {
        date: Date,
        message: String,
        type: { type: String, enum: ["encouragement", "adjustment", "milestone"] },
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("CoachPlan", coachPlanSchema)
