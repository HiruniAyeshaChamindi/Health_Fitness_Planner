const Coach = require("../models/Coach")
const CoachRequest = require("../models/CoachRequest")
const CoachReview = require("../models/CoachReview")
const User = require("../models/User")

// Get all coaches with filtering
exports.getCoaches = async (req, res) => {
  try {
    const { specialty, minRating, language, verified, search, page = 1, limit = 12 } = req.query

    const filter = { isActive: true }

    if (specialty) {
      filter.specialties = { $in: [specialty] }
    }

    if (minRating) {
      filter.rating = { $gte: Number.parseFloat(minRating) }
    }

    if (language) {
      filter.languages = { $in: [language] }
    }

    if (verified === "true") {
      filter.verified = true
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { specialties: { $in: [new RegExp(search, "i")] } },
      ]
    }

    const coaches = await Coach.find(filter)
      .populate("userId", "name email")
      .sort({ rating: -1, totalReviews: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Coach.countDocuments(filter)

    res.json({
      coaches,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get single coach profile
exports.getCoachProfile = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id).populate("userId", "name email")

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" })
    }

    // Get recent reviews
    const reviews = await CoachReview.find({ coachId: coach._id })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(10)

    res.json({ coach, reviews })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create coach profile
exports.createCoachProfile = async (req, res) => {
  try {
    const { name, bio, specialties, certifications, experienceYears, languages, availability, pricing } = req.body

    // Check if user already has a coach profile
    const existingCoach = await Coach.findOne({ userId: req.user.id })
    if (existingCoach) {
      return res.status(400).json({ message: "Coach profile already exists" })
    }

    const coach = new Coach({
      userId: req.user.id,
      name,
      bio,
      specialties,
      certifications,
      experienceYears,
      languages,
      availability,
      pricing,
    })

    await coach.save()
    res.status(201).json(coach)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update coach profile
exports.updateCoachProfile = async (req, res) => {
  try {
    const coach = await Coach.findOne({ userId: req.user.id })
    if (!coach) {
      return res.status(404).json({ message: "Coach profile not found" })
    }

    Object.assign(coach, req.body)
    await coach.save()

    res.json(coach)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Request coaching
exports.requestCoaching = async (req, res) => {
  try {
    const { coachId, message, goals, preferredSchedule, planType } = req.body

    // Check if coach exists
    const coach = await Coach.findById(coachId)
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" })
    }

    // Check if user already has a pending/active request with this coach
    const existingRequest = await CoachRequest.findOne({
      userId: req.user.id,
      coachId,
      status: { $in: ["pending", "accepted"] },
    })

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have an active request with this coach",
      })
    }

    const request = new CoachRequest({
      userId: req.user.id,
      coachId,
      message,
      goals,
      preferredSchedule,
      planType,
    })

    await request.save()

    // Populate the request for response
    await request.populate("userId", "name email")
    await request.populate("coachId", "name")

    res.status(201).json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get coach requests (for coaches)
exports.getCoachRequests = async (req, res) => {
  try {
    const coach = await Coach.findOne({ userId: req.user.id })
    if (!coach) {
      return res.status(404).json({ message: "Coach profile not found" })
    }

    const requests = await CoachRequest.find({ coachId: coach._id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })

    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Respond to coaching request
exports.respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { status, responseMessage, startDate, endDate } = req.body

    const coach = await Coach.findOne({ userId: req.user.id })
    if (!coach) {
      return res.status(404).json({ message: "Coach profile not found" })
    }

    const request = await CoachRequest.findOne({
      _id: requestId,
      coachId: coach._id,
    })

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    request.status = status
    request.responseMessage = responseMessage
    if (startDate) request.startDate = startDate
    if (endDate) request.endDate = endDate

    await request.save()

    await request.populate("userId", "name email")

    res.json(request)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get user's coaching requests
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await CoachRequest.find({ userId: req.user.id })
      .populate("coachId", "name profilePic rating")
      .sort({ createdAt: -1 })

    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
