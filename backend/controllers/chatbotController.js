const aiService = require('../services/aiService');
const User = require('../models/User');

// Handle chatbot conversation
const chatWithBot = async (req, res) => {
  try {
    console.log('=== Chatbot Request Received ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user?.id);
    
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message || message.trim().length === 0) {
      console.log('ERROR: Message is empty or missing');
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get user context if authenticated
    let userContext = {};
    if (userId) {
      const user = await User.findById(userId).select('fitnessGoal fitnessLevel dietaryPreference name');
      if (user) {
        userContext = {
          name: user.name,
          fitnessGoal: user.fitnessGoal,
          fitnessLevel: user.fitnessLevel,
          dietaryPreference: user.dietaryPreference
        };
        console.log('User context:', userContext);
      }
    }

    console.log('Calling AI service with message:', message);
    // Generate AI response
    const response = await aiService.generateChatbotResponse(message, userContext);
    console.log('AI service response:', response);

    const responseData = {
      success: true,
      message: response,
      timestamp: new Date().toISOString()
    };
    
    console.log('Sending response:', responseData);
    res.json(responseData);

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I\'m having trouble responding right now. Please try again later.',
      error: error.message
    });
  }
};

// Get health information
const getHealthInfo = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const information = await aiService.searchHealthInfo(query);

    res.json({
      success: true,
      query,
      information,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Health info search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health information',
      error: error.message
    });
  }
};

// Get quick fitness tips
const getQuickTips = async (req, res) => {
  try {
    const userId = req.user?.id;
    let userContext = {};

    if (userId) {
      const user = await User.findById(userId).select('fitnessGoal fitnessLevel activityLevel');
      if (user) {
        userContext = {
          fitnessGoal: user.fitnessGoal,
          fitnessLevel: user.fitnessLevel,
          activityLevel: user.activityLevel
        };
      }
    }

    const tips = await aiService.generateLifestyleTips(userContext);

    res.json({
      success: true,
      tips,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Quick tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate tips',
      error: error.message
    });
  }
};

// Calculate BMR and TDEE
const calculateMetabolism = async (req, res) => {
  try {
    const { age, weight, height, gender, activityLevel } = req.body;

    if (!age || !weight || !height || !gender || !activityLevel) {
      return res.status(400).json({
        success: false,
        message: 'All parameters (age, weight, height, gender, activityLevel) are required'
      });
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Calculate TDEE based on activity level
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very_active': 1.9
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    // Calculate water needs (35ml per kg body weight + activity bonus)
    const activityBonus = {
      'sedentary': 0,
      'light': 250,
      'moderate': 500,
      'active': 750,
      'very_active': 1000
    };

    const waterNeeds = (weight * 35) + activityBonus[activityLevel];

    res.json({
      success: true,
      calculations: {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        waterNeeds: Math.round(waterNeeds),
        calorieTargets: {
          weightLoss: Math.max(1200, Math.round(tdee - 500)),
          maintenance: Math.round(tdee),
          muscleGain: Math.round(tdee + 300)
        }
      },
      parameters: { age, weight, height, gender, activityLevel }
    });

  } catch (error) {
    console.error('Metabolism calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate metabolism',
      error: error.message
    });
  }
};

// Get motivational message
const getMotivation = async (req, res) => {
  try {
    const userId = req.user?.id;
    let userName = 'there';
    let fitnessGoal = 'your fitness goals';

    if (userId) {
      const user = await User.findById(userId).select('name fitnessGoal');
      if (user) {
        userName = user.name;
        fitnessGoal = user.fitnessGoal || 'your fitness goals';
      }
    }

    const motivationalPrompt = `Generate a short, inspiring motivational message for ${userName} who is working towards ${fitnessGoal}. Keep it under 100 words and make it personal and encouraging.`;
    
    const motivation = await aiService.generateChatbotResponse(motivationalPrompt, { userName, fitnessGoal });

    res.json({
      success: true,
      motivation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Motivation generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate motivation',
      motivation: `Keep going, ${userName || 'champion'}! Every step you take brings you closer to your goals. You've got this! 💪`
    });
  }
};

module.exports = {
  chatWithBot,
  getHealthInfo,
  getQuickTips,
  calculateMetabolism,
  getMotivation
};
