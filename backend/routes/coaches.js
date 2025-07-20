const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const {
  getCoaches,
  getCoachProfile,
  createCoachProfile,
  updateCoachProfile,
  requestCoaching,
  getCoachRequests,
  respondToRequest,
  getUserRequests,
} = require("../controllers/coachController")

// Public routes
router.get("/", getCoaches)
router.get("/:id", getCoachProfile)

// Protected routes
router.post("/profile", auth, createCoachProfile)
router.put("/profile", auth, updateCoachProfile)
router.post("/request", auth, requestCoaching)
router.get("/requests/incoming", auth, getCoachRequests)
router.get("/requests/my", auth, getUserRequests)
router.put("/requests/:requestId/respond", auth, respondToRequest)

module.exports = router
