const CoachReview = require("../models/CoachReview")
const Coach = require("../models/Coach")
const CoachRequest = require("../models/CoachRequest")

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { coachId, requestId, rating, reviewText, categories } = req.body

    // Verify the coaching session is completed
    const request = await CoachRequest.findOne({
      _id: requestId,
      userId: req.user.id,
      coachId,
      status: "completed",
    })

    if (!request) {
      return res.status(404).json({
        message: "Completed coaching session not found",
      })
    }

    // Check if review already exists
    const existingReview = await CoachReview.findOne({
      userId: req.user.id,
      coachId,
      requestId,
    })

    if (existingReview) {
      return res.status(400).json({
        message: "Review already exists for this session",
      })
    }

    const review = new CoachReview({
      userId: req.user.id,
      coachId,
      requestId,
      rating,
      reviewText,
      categories,
    })

    await review.save()

    // Update coach's average rating
    await updateCoachRating(coachId)

    await review.populate("userId", "name")

    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get reviews for a coach
exports.getCoachReviews = async (req, res) => {
  try {
    const { coachId } = req.params
    const { page = 1, limit = 10 } = req.query

    const reviews = await CoachReview.find({ coachId })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await CoachReview.countDocuments({ coachId })

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Helper function to update coach rating
async function updateCoachRating(coachId) {
  const reviews = await CoachReview.find({ coachId })

  if (reviews.length === 0) return

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length

  await Coach.findByIdAndUpdate(coachId, {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: reviews.length,
  })
}

module.exports = { createReview: exports.createReview, getCoachReviews: exports.getCoachReviews }
