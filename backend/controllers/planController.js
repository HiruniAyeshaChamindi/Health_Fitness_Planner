const HealthPlan = require('../models/HealthPlan');
const User = require('../models/User');
const aiService = require('../services/aiService');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Generate a new health plan
const generateHealthPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planType = 'daily', customPreferences = {} } = req.body;

    // Get user profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare user profile for AI
    const userProfile = {
      name: user.name,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      activityLevel: user.activityLevel,
      fitnessGoal: user.fitnessGoal,
      fitnessLevel: user.fitnessLevel,
      dietaryPreference: user.dietaryPreference,
      allergies: user.allergies,
      medicalConditions: user.medicalConditions,
      dailyCalorieTarget: user.dailyCalorieTarget,
      dailyWaterTarget: user.dailyWaterTarget,
      workoutDaysPerWeek: user.workoutDaysPerWeek,
      workoutDuration: user.workoutDuration,
      availableEquipment: user.availableEquipment,
      ...customPreferences
    };

    // Generate meal plan
    console.log('Generating meal plan...');
    const mealPlan = await aiService.generateMealPlan(userProfile);

    // Generate workout plan
    console.log('Generating workout plan...');
    const workoutPlan = await aiService.generateWorkoutPlan(userProfile);

    // Generate holistic recommendations
    console.log('Generating holistic recommendations...');
    const aiRecommendations = await aiService.generateHolisticHealthPlan(
      userProfile, 
      mealPlan, 
      workoutPlan
    );

    // Generate lifestyle tips
    const lifestyleTips = await aiService.generateLifestyleTips(userProfile);

    // Create health plan document
    const healthPlan = new HealthPlan({
      user: userId,
      plan_name: `${user.name}'s ${fitnessGoal || 'Health'} Plan`,
      plan_type: planType,
      date: new Date(),
      workout_plan: workoutPlan,
      meal_plan: mealPlan,
      ai_recommendations: aiRecommendations,
      lifestyle_tips: lifestyleTips,
      motivation_message: `Stay strong, ${user.name}! Every step counts towards your ${user.fitnessGoal} goal!`
    });

    await healthPlan.save();

    res.status(201).json({
      success: true,
      message: 'Health plan generated successfully',
      plan: healthPlan
    });

  } catch (error) {
    console.error('Error generating health plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate health plan',
      error: error.message
    });
  }
};

// Get user's health plans
const getUserHealthPlans = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      planType,
      startDate,
      endDate 
    } = req.query;

    // Build query
    const query = { user: userId };
    
    if (status) query.status = status;
    if (planType) query.plan_type = planType;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const plans = await HealthPlan.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('plan_name plan_type date status completion_percentage user_feedback createdAt');

    const total = await HealthPlan.countDocuments(query);

    res.json({
      success: true,
      plans,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching health plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health plans',
      error: error.message
    });
  }
};

// Get specific health plan
const getHealthPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    const plan = await HealthPlan.findOne({ 
      _id: planId, 
      user: userId 
    }).populate('user', 'name email');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Health plan not found'
      });
    }

    res.json({
      success: true,
      plan
    });

  } catch (error) {
    console.error('Error fetching health plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health plan',
      error: error.message
    });
  }
};

// Update health plan
const updateHealthPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const plan = await HealthPlan.findOneAndUpdate(
      { _id: planId, user: userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Health plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Health plan updated successfully',
      plan
    });

  } catch (error) {
    console.error('Error updating health plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update health plan',
      error: error.message
    });
  }
};

// Submit feedback for health plan
const submitPlanFeedback = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;
    const { rating, comment, difficultyLevel } = req.body;

    const plan = await HealthPlan.findOne({ _id: planId, user: userId });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Health plan not found'
      });
    }

    plan.user_feedback = {
      rating,
      comment,
      difficulty_level: difficultyLevel
    };

    await plan.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: plan.user_feedback
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};

// Generate PDF for health plan
const generatePlanPDF = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    const plan = await HealthPlan.findOne({ 
      _id: planId, 
      user: userId 
    }).populate('user', 'name email');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Health plan not found'
      });
    }

    // Create PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${plan.plan_name}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('FitGenie Health & Fitness Plan', 50, 50);
    doc.fontSize(16).text(`Plan for: ${plan.user.name}`, 50, 80);
    doc.fontSize(12).text(`Generated on: ${plan.createdAt.toDateString()}`, 50, 100);
    
    doc.moveDown();
    
    // Workout Plan Section
    doc.fontSize(16).text('Workout Plan', 50, 140);
    doc.fontSize(12).text(`Duration: ${plan.workout_plan?.duration || 'N/A'} minutes`, 50, 160);
    doc.text(`Type: ${plan.workout_plan?.type || 'Mixed'}`, 50, 180);
    
    if (plan.workout_plan?.exercises) {
      doc.text('Exercises:', 50, 200);
      let yPos = 220;
      plan.workout_plan.exercises.forEach((exercise, index) => {
        doc.text(`${index + 1}. ${exercise.name}`, 70, yPos);
        if (exercise.sets && exercise.reps) {
          doc.text(`   ${exercise.sets} sets × ${exercise.reps} reps`, 70, yPos + 15);
        }
        yPos += 35;
      });
    }

    // Meal Plan Section
    doc.addPage();
    doc.fontSize(16).text('Meal Plan', 50, 50);
    
    if (plan.meal_plan?.meals) {
      let yPos = 80;
      plan.meal_plan.meals.forEach((meal) => {
        doc.fontSize(14).text(meal.name, 50, yPos);
        doc.fontSize(12).text(`Type: ${meal.type}`, 50, yPos + 20);
        doc.text(`Calories: ${meal.nutrition?.calories || 'N/A'}`, 50, yPos + 35);
        yPos += 70;
      });
    }

    // AI Recommendations
    if (plan.ai_recommendations) {
      doc.addPage();
      doc.fontSize(16).text('Personalized Recommendations', 50, 50);
      doc.fontSize(12).text(plan.ai_recommendations, 50, 80, { width: 500 });
    }

    // Finalize PDF
    doc.end();

    // Update plan to mark PDF as generated
    plan.pdf_generated = true;
    await plan.save();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
};

// Email health plan
const emailHealthPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    const plan = await HealthPlan.findOne({ 
      _id: planId, 
      user: userId 
    }).populate('user', 'name email');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Health plan not found'
      });
    }

    // Configure email transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: plan.user.email,
      subject: `Your FitGenie Health Plan - ${plan.plan_name}`,
      html: `
        <h2>Your Personalized Health Plan</h2>
        <p>Hi ${plan.user.name},</p>
        <p>Your customized health and fitness plan has been generated!</p>
        
        <h3>Workout Plan</h3>
        <p>Duration: ${plan.workout_plan?.duration || 'N/A'} minutes</p>
        <p>Type: ${plan.workout_plan?.type || 'Mixed'}</p>
        
        <h3>Meal Plan</h3>
        <p>Total Calories: ${plan.meal_plan?.total_nutrition?.calories || 'N/A'}</p>
        
        <h3>Recommendations</h3>
        <p>${plan.ai_recommendations}</p>
        
        <p>Keep up the great work!</p>
        <p>Best regards,<br>The FitGenie Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Update plan to mark as emailed
    plan.emailed_to_user = true;
    plan.email_sent_date = new Date();
    await plan.save();

    res.json({
      success: true,
      message: 'Health plan emailed successfully'
    });

  } catch (error) {
    console.error('Error emailing health plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to email health plan',
      error: error.message
    });
  }
};

// Delete health plan
const deleteHealthPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    const plan = await HealthPlan.findOneAndDelete({ 
      _id: planId, 
      user: userId 
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Health plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Health plan deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting health plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete health plan',
      error: error.message
    });
  }
};

module.exports = {
  generateHealthPlan,
  getUserHealthPlans,
  getHealthPlan,
  updateHealthPlan,
  submitPlanFeedback,
  generatePlanPDF,
  emailHealthPlan,
  deleteHealthPlan
};
