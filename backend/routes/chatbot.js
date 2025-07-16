const express = require('express');
const {
  chatWithBot,
  getHealthInfo,
  getQuickTips,
  calculateMetabolism,
  getMotivation
} = require('../controllers/chatbotController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/chatbot/chat
// @desc    Chat with the AI assistant
// @access  Public/Private (enhanced features when authenticated)
router.post('/chat', (req, res, next) => {
  // Optional authentication - enhance experience if logged in
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    auth(req, res, (err) => {
      if (err) {
        // Continue without authentication if token is invalid
        req.user = null;
      }
      next();
    });
  } else {
    next();
  }
}, chatWithBot);

// @route   GET /api/chatbot/health-info
// @desc    Get health information
// @access  Public
router.get('/health-info', getHealthInfo);

// @route   GET /api/chatbot/tips
// @desc    Get quick fitness tips
// @access  Public/Private (personalized when authenticated)
router.get('/tips', (req, res, next) => {
  // Optional authentication
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    auth(req, res, (err) => {
      if (err) {
        req.user = null;
      }
      next();
    });
  } else {
    next();
  }
}, getQuickTips);

// @route   POST /api/chatbot/calculate
// @desc    Calculate BMR, TDEE, and water needs
// @access  Public
router.post('/calculate', calculateMetabolism);

// @route   GET /api/chatbot/motivation
// @desc    Get motivational message
// @access  Public/Private (personalized when authenticated)
router.get('/motivation', (req, res, next) => {
  // Optional authentication
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    auth(req, res, (err) => {
      if (err) {
        req.user = null;
      }
      next();
    });
  } else {
    next();
  }
}, getMotivation);

module.exports = router;
