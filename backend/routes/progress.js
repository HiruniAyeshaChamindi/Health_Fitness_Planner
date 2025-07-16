const express = require('express');
const {
  logDailyProgress,
  getProgressHistory,
  getProgressAnalytics,
  updateDailyGoals,
  getTodayProgress
} = require('../controllers/progressController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/progress
// @desc    Log daily progress
// @access  Private
router.post('/', auth, logDailyProgress);

// @route   GET /api/progress
// @desc    Get progress history
// @access  Private
router.get('/', auth, getProgressHistory);

// @route   GET /api/progress/analytics
// @desc    Get progress analytics
// @access  Private
router.get('/analytics', auth, getProgressAnalytics);

// @route   GET /api/progress/today
// @desc    Get today's progress
// @access  Private
router.get('/today', auth, getTodayProgress);

// @route   PUT /api/progress/goals
// @desc    Update daily goals
// @access  Private
router.put('/goals', auth, updateDailyGoals);

module.exports = router;
