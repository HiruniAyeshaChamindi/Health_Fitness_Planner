const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      password,
      age,
      weight,
      height,
      gender,
      activityLevel,
      fitnessGoal,
      fitnessLevel,
      dietaryPreference,
      allergies,
      medicalConditions,
      workoutDaysPerWeek,
      workoutDuration,
      availableEquipment
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      age,
      weight,
      height,
      gender,
      activityLevel,
      fitnessGoal,
      fitnessLevel,
      dietaryPreference,
      allergies: allergies || [],
      medicalConditions: medicalConditions || [],
      workoutDaysPerWeek: workoutDaysPerWeek || 3,
      workoutDuration: workoutDuration || 45,
      availableEquipment: availableEquipment || ['none']
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      activityLevel: user.activityLevel,
      fitnessGoal: user.fitnessGoal,
      fitnessLevel: user.fitnessLevel,
      dietaryPreference: user.dietaryPreference,
      bmr: user.bmr,
      tdee: user.tdee,
      dailyCalorieTarget: user.dailyCalorieTarget,
      dailyWaterTarget: user.dailyWaterTarget
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Login validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    console.log('Attempting login for email:', email);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('User found:', user.email);

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      activityLevel: user.activityLevel,
      fitnessGoal: user.fitnessGoal,
      fitnessLevel: user.fitnessLevel,
      dietaryPreference: user.dietaryPreference,
      bmr: user.bmr,
      tdee: user.tdee,
      dailyCalorieTarget: user.dailyCalorieTarget,
      dailyWaterTarget: user.dailyWaterTarget,
      lastLogin: user.lastLogin
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  try {
    const token = generateToken(req.user.id);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Logout User (client-side token removal)
const logoutUser = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshToken,
  logoutUser
};
