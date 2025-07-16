const express = require('express');
const {
  generateHealthPlan,
  getUserHealthPlans,
  getHealthPlan,
  updateHealthPlan,
  submitPlanFeedback,
  generatePlanPDF,
  emailHealthPlan,
  deleteHealthPlan
} = require('../controllers/planController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/plans/generate
// @desc    Generate a new health plan
// @access  Private
router.post('/generate', auth, generateHealthPlan);

// @route   GET /api/plans
// @desc    Get user's health plans
// @access  Private
router.get('/', auth, getUserHealthPlans);

// @route   GET /api/plans/:planId
// @desc    Get specific health plan
// @access  Private
router.get('/:planId', auth, getHealthPlan);

// @route   PUT /api/plans/:planId
// @desc    Update health plan
// @access  Private
router.put('/:planId', auth, updateHealthPlan);

// @route   POST /api/plans/:planId/feedback
// @desc    Submit feedback for health plan
// @access  Private
router.post('/:planId/feedback', auth, submitPlanFeedback);

// @route   GET /api/plans/:planId/pdf
// @desc    Generate and download PDF of health plan
// @access  Private
router.get('/:planId/pdf', auth, generatePlanPDF);

// @route   POST /api/plans/:planId/email
// @desc    Email health plan to user
// @access  Private
router.post('/:planId/email', auth, emailHealthPlan);

// @route   DELETE /api/plans/:planId
// @desc    Delete health plan
// @access  Private
router.delete('/:planId', auth, deleteHealthPlan);

module.exports = router;
