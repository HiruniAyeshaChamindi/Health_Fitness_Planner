const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // strength, cardio, flexibility, etc.
  muscle_groups: [String],
  equipment: [String],
  sets: Number,
  reps: String, // Could be "12-15" or "30 seconds"
  duration: Number, // in minutes
  rest_time: Number, // in seconds
  instructions: String,
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'] 
  },
  calories_burned_per_minute: Number
});

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true 
  },
  ingredients: [{
    name: String,
    quantity: String,
    unit: String
  }],
  instructions: String,
  prep_time: Number, // in minutes
  cook_time: Number, // in minutes
  servings: Number,
  nutrition: {
    calories: Number,
    protein: Number, // in grams
    carbs: Number, // in grams
    fat: Number, // in grams
    fiber: Number, // in grams
    sugar: Number, // in grams
    sodium: Number // in mg
  },
  dietary_tags: [String], // keto, vegetarian, vegan, etc.
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'] 
  }
});

const workoutPlanSchema = new mongoose.Schema({
  name: String,
  type: { 
    type: String, 
    enum: ['strength', 'cardio', 'flexibility', 'mixed'] 
  },
  duration: Number, // total duration in minutes
  exercises: [exerciseSchema],
  warm_up: [exerciseSchema],
  cool_down: [exerciseSchema],
  target_muscle_groups: [String],
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'] 
  },
  estimated_calories: Number
});

const mealPlanSchema = new mongoose.Schema({
  meals: [mealSchema],
  total_nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number
  },
  dietary_preference: String,
  hydration_goal: Number // in ml
});

const healthPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Plan Details
  plan_name: String,
  plan_type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  
  // Date Information
  date: {
    type: Date,
    default: Date.now
  },
  week_number: Number,
  
  // Generated Plans
  workout_plan: workoutPlanSchema,
  meal_plan: mealPlanSchema,
  
  // AI Generated Content
  ai_recommendations: String,
  lifestyle_tips: [String],
  motivation_message: String,
  
  // Plan Status
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'archived'],
    default: 'active'
  },
  
  // User Interaction
  user_feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    difficulty_level: {
      type: String,
      enum: ['too_easy', 'just_right', 'too_hard']
    }
  },
  
  // Tracking
  completion_percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Sharing
  is_public: {
    type: Boolean,
    default: false
  },
  shared_url: String,
  
  // PDF Generation
  pdf_generated: {
    type: Boolean,
    default: false
  },
  pdf_url: String,
  
  // Email
  emailed_to_user: {
    type: Boolean,
    default: false
  },
  email_sent_date: Date
}, {
  timestamps: true
});

// Indexes for better performance
healthPlanSchema.index({ user: 1, date: -1 });
healthPlanSchema.index({ user: 1, status: 1 });
healthPlanSchema.index({ plan_type: 1, date: -1 });

// Calculate total workout duration
healthPlanSchema.methods.getTotalWorkoutDuration = function() {
  if (!this.workout_plan) return 0;
  return this.workout_plan.duration || 0;
};

// Calculate total calories from meals
healthPlanSchema.methods.getTotalDailyCalories = function() {
  if (!this.meal_plan || !this.meal_plan.total_nutrition) return 0;
  return this.meal_plan.total_nutrition.calories || 0;
};

// Get plan summary
healthPlanSchema.methods.getPlanSummary = function() {
  return {
    id: this._id,
    plan_name: this.plan_name,
    date: this.date,
    workout_duration: this.getTotalWorkoutDuration(),
    total_calories: this.getTotalDailyCalories(),
    status: this.status,
    completion_percentage: this.completion_percentage,
    user_rating: this.user_feedback?.rating
  };
};

module.exports = mongoose.model('HealthPlan', healthPlanSchema);
