// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const { getCoaches, createCoach, bookAppointment, getUserAppointments } = require('../controllers/coachController');

// router.get('/coaches', getCoaches); // Public: List all coaches
// router.post('/coaches', protect, createCoach); // Admin-only: Create coach
// router.post('/appointments', protect, bookAppointment); // Authenticated: Book appointment
// router.get('/appointments', protect, getUserAppointments); // Authenticated: Get user's appointments

// module.exports = router;