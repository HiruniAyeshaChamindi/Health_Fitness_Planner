const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const { createReview, getCoachReviews } = require("../controllers/reviewController")

router.post("/", auth, createReview)
router.get("/coach/:coachId", getCoachReviews)

module.exports = router
