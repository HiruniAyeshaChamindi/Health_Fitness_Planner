const mongoose = require('mongoose');

const progressEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  // Physical Measurements
  weight: Number,
  body_fat_percentage: Number,
  muscle_mass: Number,
  
  // Body Measurements (in cm)
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    thighs: Number,
    neck: Number
  },
  
  // Daily Activities
  workouts_completed: [{
    workout_id: mongoose.Schema.Types.ObjectId,
    plan_id: mongoose.Schema.Types.ObjectId,
    duration: Number, // actual duration in minutes
    calories_burned: Number,
    difficulty_rating: {
      type: Number,
      min: 1,
      max: 5
    },
    completion_percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    notes: String
  }],
  
  // Nutrition Tracking
  meals_logged: [{
    meal_id: mongoose.Schema.Types.ObjectId,
    plan_id: mongoose.Schema.Types.ObjectId,
    actual_nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
      sugar: Number,
      sodium: Number
    },
    completion_percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    satisfaction_rating: {
      type: Number,
      min: 1,
      max: 5
    },
    notes: String
  }],
  
  // Hydration
  water_intake: {
    target: Number, // in ml
    actual: Number, // in ml
    glasses_consumed: Number
  },
  
  // Sleep
  sleep: {
    bedtime: Date,
    wake_time: Date,
    hours_slept: Number,
    quality_rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Energy and Mood
  energy_level: {
    type: Number,
    min: 1,
    max: 10
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'neutral', 'low', 'poor']
  },
  
  // Daily Goals Completion
  daily_goals: {
    workout_completed: { type: Boolean, default: false },
    meal_plan_followed: { type: Boolean, default: false },
    water_goal_met: { type: Boolean, default: false },
    sleep_goal_met: { type: Boolean, default: false }
  },
  
  // Photos
  progress_photos: [{
    url: String,
    type: {
      type: String,
      enum: ['front', 'side', 'back', 'other']
    },
    uploaded_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Additional Notes
  notes: String,
  achievements: [String], // Array of achievement descriptions
  
  // Calculated Fields
  bmi: Number,
  calorie_deficit_surplus: Number,
  
}, {
  timestamps: true
});

// Indexes for better performance
progressEntrySchema.index({ user: 1, date: -1 });
progressEntrySchema.index({ user: 1, 'daily_goals.workout_completed': 1 });
progressEntrySchema.index({ date: -1 });

// Calculate BMI
progressEntrySchema.methods.calculateBMI = function(height) {
  if (!this.weight || !height) return null;
  const heightInMeters = height / 100;
  return Math.round((this.weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

// Calculate daily goal completion percentage
progressEntrySchema.methods.getDailyGoalCompletion = function() {
  const goals = this.daily_goals;
  const totalGoals = 4; // workout, meal, water, sleep
  let completedGoals = 0;
  
  if (goals.workout_completed) completedGoals++;
  if (goals.meal_plan_followed) completedGoals++;
  if (goals.water_goal_met) completedGoals++;
  if (goals.sleep_goal_met) completedGoals++;
  
  return Math.round((completedGoals / totalGoals) * 100);
};

// Get total calories consumed
progressEntrySchema.methods.getTotalCaloriesConsumed = function() {
  return this.meals_logged.reduce((total, meal) => {
    return total + (meal.actual_nutrition?.calories || 0);
  }, 0);
};

// Get total workout time
progressEntrySchema.methods.getTotalWorkoutTime = function() {
  return this.workouts_completed.reduce((total, workout) => {
    return total + (workout.duration || 0);
  }, 0);
};

// Update BMI before saving
progressEntrySchema.pre('save', async function(next) {
  if (this.weight && this.user) {
    try {
      const User = mongoose.model('User');
      const user = await User.findById(this.user);
      if (user && user.height) {
        this.bmi = this.calculateBMI(user.height);
      }
    } catch (error) {
      console.error('Error calculating BMI:', error);
    }
  }
  next();
});

const weeklyProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  week_start_date: {
    type: Date,
    required: true
  },
  week_end_date: {
    type: Date,
    required: true
  },
  
  // Weekly Summaries
  total_workouts: Number,
  total_workout_time: Number, // in minutes
  total_calories_burned: Number,
  average_workout_rating: Number,
  
  total_calories_consumed: Number,
  average_meal_satisfaction: Number,
  
  average_water_intake: Number, // in ml
  water_goal_achievement_rate: Number, // percentage
  
  average_sleep_hours: Number,
  average_sleep_quality: Number,
  
  // Weight Progress
  starting_weight: Number,
  ending_weight: Number,
  weight_change: Number,
  
  // Goal Achievement
  weekly_goal_completion: Number, // percentage
  
  // Insights
  insights: [String],
  recommendations: [String]
}, {
  timestamps: true
});

// Create models
const ProgressEntry = mongoose.model('ProgressEntry', progressEntrySchema);
const WeeklyProgress = mongoose.model('WeeklyProgress', weeklyProgressSchema);

module.exports = {
  ProgressEntry,
  WeeklyProgress
};
