const express = require('express');
const { body } = require('express-validator');
const {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  getUserStats,
  changePassword,
  deleteUserAccount
} = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('age').optional().isInt({ min: 10, max: 100 }).withMessage('Age must be between 10 and 100'),
  body('weight').optional().isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300 kg'),
  body('height').optional().isFloat({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('activityLevel').optional().isIn(['sedentary', 'light', 'moderate', 'active', 'very_active']).withMessage('Invalid activity level'),
  body('fitnessGoal').optional().isIn(['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'maintenance']).withMessage('Invalid fitness goal'),
  body('fitnessLevel').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid fitness level'),
  body('dietaryPreference').optional().isIn(['balanced', 'keto', 'vegetarian', 'vegan', 'paleo', 'low_carb', 'mediterranean']).withMessage('Invalid dietary preference'),
  body('workoutDaysPerWeek').optional().isInt({ min: 1, max: 7 }).withMessage('Workout days must be between 1 and 7'),
  body('workoutDuration').optional().isInt({ min: 15, max: 120 }).withMessage('Workout duration must be between 15 and 120 minutes')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfileValidation, updateUserProfile);

// @route   PUT /api/users/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', auth, updateUserSettings);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, getUserStats);

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, changePasswordValidation, changePassword);

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, deleteUserAccount);

module.exports = router;
