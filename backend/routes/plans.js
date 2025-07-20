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










// //***********************/

// // Backend API endpoints (Node.js/Express example)

// // routes/plans.js
// const express = require('express');
// const router = express.Router();
// const { authenticateToken } = require('../middleware/auth');
// const PlanService = require('../services/planService');

// // Generate workout plan
// router.post('/generate-workout', authenticateToken, async (req, res) => {
//   try {
//     const { userProfile, workoutPreferences } = req.body;
//     const userId = req.user.id;

//     // Validate required fields
//     if (!userProfile || !workoutPreferences) {
//       return res.status(400).json({ 
//         error: 'User profile and workout preferences are required' 
//       });
//     }

//     // Generate workout plan using AI service or algorithm
//     const workoutPlan = await PlanService.generateWorkoutPlan({
//       userId,
//       userProfile,
//       workoutPreferences,
//     });

//     // Save the plan to database
//     const savedPlan = await PlanService.savePlan(userId, workoutPlan);

//     res.json(savedPlan);
//   } catch (error) {
//     console.error('Error generating workout plan:', error);
//     res.status(500).json({ error: 'Failed to generate workout plan' });
//   }
// });

// // Generate meal plan
// router.post('/generate-meal', authenticateToken, async (req, res) => {
//   try {
//     const { userProfile, mealPreferences } = req.body;
//     const userId = req.user.id;

//     // Validate required fields
//     if (!userProfile || !mealPreferences) {
//       return res.status(400).json({ 
//         error: 'User profile and meal preferences are required' 
//       });
//     }

//     // Generate meal plan using AI service or algorithm
//     const mealPlan = await PlanService.generateMealPlan({
//       userId,
//       userProfile,
//       mealPreferences,
//     });

//     // Save the plan to database
//     const savedPlan = await PlanService.savePlan(userId, mealPlan);

//     res.json(savedPlan);
//   } catch (error) {
//     console.error('Error generating meal plan:', error);
//     res.status(500).json({ error: 'Failed to generate meal plan' });
//   }
// });

// // Get exercise details
// router.get('/exercises/:id', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const exerciseDetails = await PlanService.getExerciseDetails(id);
    
//     if (!exerciseDetails) {
//       return res.status(404).json({ error: 'Exercise not found' });
//     }

//     res.json(exerciseDetails);
//   } catch (error) {
//     console.error('Error fetching exercise details:', error);
//     res.status(500).json({ error: 'Failed to fetch exercise details' });
//   }
// });

// module.exports = router;

// // services/planService.js
// const OpenAI = require('openai'); // or your preferred AI service
// const Exercise = require('../models/Exercise');
// const Plan = require('../models/Plan');

// class PlanService {
//   constructor() {
//     this.openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });
//   }

//   async generateWorkoutPlan({ userId, userProfile, workoutPreferences }) {
//     try {
//       // Create prompt for AI generation
//       const prompt = this.createWorkoutPrompt(userProfile, workoutPreferences);
      
//       // Generate using AI (OpenAI GPT-4 example)
//       const response = await this.openai.chat.completions.create({
//         model: 'gpt-4',
//         messages: [
//           {
//             role: 'system',
//             content: 'You are a certified personal trainer and fitness expert. Generate detailed, safe, and effective workout plans based on user preferences and fitness levels.'
//           },
//           {
//             role: 'user',
//             content: prompt
//           }
//         ],
//         temperature: 0.7,
//       });

//       // Parse the AI response
//       const aiResponse = JSON.parse(response.choices[0].message.content);
      
//       // Enrich with exercise data from database
//       const enrichedPlan = await this.enrichWorkoutPlan(aiResponse);
      
//       return enrichedPlan;
//     } catch (error) {
//       console.error('Error in generateWorkoutPlan:', error);
//       throw error;
//     }
//   }

//   async generateMealPlan({ userId, userProfile, mealPreferences }) {
//     try {
//       // Create prompt for AI generation
//       const prompt = this.createMealPrompt(userProfile, mealPreferences);
      
//       // Generate using AI
//       const response = await this.openai.chat.completions.create({
//         model: 'gpt-4',
//         messages: [
//           {
//             role: 'system',
//             content: 'You are a certified nutritionist and dietitian. Generate healthy, balanced meal plans based on user preferences, dietary restrictions, and fitness goals.'
//           },
//           {
//             role: 'user',
//             content: prompt
//           }
//         ],
//         temperature: 0.7,
//       });

//       // Parse the AI response
//       const aiResponse = JSON.parse(response.choices[0].message.content);
      
//       // Enrich with nutritional data
//       const enrichedPlan = await this.enrichMealPlan(aiResponse);
      
//       return enrichedPlan;
//     } catch (error) {
//       console.error('Error in generateMealPlan:', error);
//       throw error;
//     }
//   }

//   createWorkoutPrompt(userProfile, workoutPreferences) {
//     return `
//       Generate a personalized workout plan with the following specifications:

//       User Profile:
//       - Fitness Level: ${userProfile.fitnessLevel}
//       - Fitness Goal: ${userProfile.fitnessGoal}
//       - Age: ${userProfile.age}
//       - Weight: ${userProfile.weight}kg
//       - Height: ${userProfile.height}cm

//       Workout Preferences:
//       - Session Duration: ${workoutPreferences.sessionDuration} minutes
//       - Workouts per Week: ${workoutPreferences.workoutsPerWeek}
//       - Equipment Available: ${workoutPreferences.equipmentAvailable}
//       - Focus Areas: ${workoutPreferences.focusAreas.join(', ')}
//       - Injury Limitations: ${workoutPreferences.injuryLimitations}
//       - Specific Goals: ${workoutPreferences.specificGoals}

//       Please return a JSON object with this structure:
//       {
//         "plan_name": "string",
//         "type": "workout",
//         "workout_plan": {
//           "duration": number,
//           "frequency": "string",
//           "type": "string",
//           "equipment": "string",
//           "exercises": [
//             {
//               "name": "string",
//               "sets": number,
//               "reps": number,
//               "weight": "string (optional)",
//               "restTime": "string",
//               "description": "string",
//               "category": "string",
//               "muscles": ["string"],
//               "difficulty": "string"
//             }
//           ]
//         },
//         "ai_recommendations": "string",
//         "lifestyle_tips": ["string"]
//       }

//       Ensure the plan is safe, progressive, and appropriate for the user's fitness level and any injury limitations.
//     `;
//   }

//   createMealPrompt(userProfile, mealPreferences) {
//     return `
//       Generate a personalized meal plan with the following specifications:

//       User Profile:
//       - Dietary Preference: ${userProfile.dietaryPreference}
//       - Daily Calorie Target: ${userProfile.dailyCalorieTarget}
//       - Fitness Goal: ${userProfile.fitnessGoal}
//       - Age: ${userProfile.age}
//       - Weight: ${userProfile.weight}kg
//       - Height: ${userProfile.height}cm
//       - Activity Level: ${userProfile.activityLevel}

//       Meal Preferences:
//       - Meals per Day: ${mealPreferences.mealsPerDay}
//       - Snacks Included: ${mealPreferences.snacksIncluded}
//       - Cooking Time: ${mealPreferences.cookingTime}
//       - Cuisine Type: ${mealPreferences.cuisineType}
//       - Allergies: ${mealPreferences.allergies}
//       - Specific Goals: ${mealPreferences.specificGoals}

//       Please return a JSON object with this structure:
//       {
//         "plan_name": "string",
//         "type": "meal",
//         "meal_plan": {
//           "meals": [
//             {
//               "name": "string",
//               "type": "string",
//               "calories": number,
//               "protein": number,
//               "carbs": number,
//               "fat": number,
//               "fiber": number,
//               "prep_time": number,
//               "ingredients": ["string"],
//               "instructions": ["string"]
//             }
//           ],
//           "total_nutrition": {
//             "calories": number,
//             "protein": number,
//             "carbs": number,
//             "fat": number,
//             "fiber": number
//           },
//           "daily_target": number,
//           "preferences": object
//         },
//         "ai_recommendations": "string",
//         "lifestyle_tips": ["string"]
//       }

//       Ensure the meal plan meets the user's nutritional needs and dietary restrictions.
//     `;
//   }

//   async enrichWorkoutPlan(plan) {
//     // Add exercise details from database
//     const exercises = await Promise.all(
//       plan.workout_plan.exercises.map(async (exercise) => {
//         const exerciseData = await Exercise.findOne({ name: exercise.name });
//         return {
//           ...exercise,
//           id: exerciseData?._id,
//           videos: exerciseData?.videos || [],
//           instructions: exerciseData?.instructions || exercise.description,
//         };
//       })
//     );

//     return {
//       ...plan,
//       workout_plan: {
//         ...plan.workout_plan,
//         exercises,
//       },
//     };
//   }

//   async enrichMealPlan(plan) {
//     // Add nutritional data and recipe details
//     return plan; // Implement meal enrichment logic
//   }

//   async getExerciseDetails(exerciseId) {
//     try {
//       const exercise = await Exercise.findById(exerciseId);
//       return exercise;
//     } catch (error) {
//       console.error('Error fetching exercise details:', error);
//       throw error;
//     }
//   }

//   async savePlan(userId, plan) {
//     try {
//       const newPlan = new Plan({
//         userId,
//         ...plan,
//         createdAt: new Date(),
//       });

//       const savedPlan = await newPlan.save();
//       return savedPlan;
//     } catch (error) {
//       console.error('Error saving plan:', error);
//       throw error;
//     }
//   }
// }

// module.exports = new PlanService();