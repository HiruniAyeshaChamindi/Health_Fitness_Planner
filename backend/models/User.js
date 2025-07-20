// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   // Basic Information
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     trim: true,
//     validate: {
//       validator: function(v) {
//         // Allow empty string or valid phone number format
//         return !v || /^[\+]?[(]?[\d\s\-\(\)]{10,}$/.test(v);
//       },
//       message: 'Please enter a valid phone number'
//     }
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
  
//   // Physical Information
//   age: {
//     type: Number,
//     required: true,
//     min: 10,
//     max: 100
//   },
//   weight: {
//     type: Number,
//     required: true,
//     min: 30,
//     max: 300
//   },
//   height: {
//     type: Number,
//     required: true,
//     min: 100,
//     max: 250
//   },
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'other'],
//     required: true
//   },
  
//   // Fitness Information
//   activityLevel: {
//     type: String,
//     enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
//     required: true
//   },
//   fitnessGoal: {
//     type: String,
//     enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'maintenance'],
//     required: true
//   },
//   fitnessLevel: {
//     type: String,
//     enum: ['beginner', 'intermediate', 'advanced'],
//     required: true
//   },
  
//   // Dietary Information
//   dietaryPreference: {
//     type: String,
//     enum: ['balanced', 'keto', 'vegetarian', 'vegan', 'paleo', 'low_carb', 'mediterranean'],
//     required: true
//   },
//   allergies: [{
//     type: String
//   }],
  
//   // Health Information
//   medicalConditions: [{
//     type: String
//   }],
//   medications: [{
//     type: String
//   }],
  
//   // Calculated Values
//   bmr: Number, // Basal Metabolic Rate
//   tdee: Number, // Total Daily Energy Expenditure
//   dailyCalorieTarget: Number,
//   dailyWaterTarget: Number, // in ml
  
//   // Preferences
//   workoutDaysPerWeek: {
//     type: Number,
//     min: 1,
//     max: 7,
//     default: 3
//   },
//   workoutDuration: {
//     type: Number,
//     min: 15,
//     max: 120,
//     default: 45
//   },
//   availableEquipment: [{
//     type: String,
//     enum: ['none', 'dumbbells', 'barbell', 'resistance_bands', 'yoga_mat', 'cardio_machine', 'full_gym']
//   }],
  
//   // Settings
//   notifications: {
//     email: { type: Boolean, default: true },
//     workout: { type: Boolean, default: true },
//     meal: { type: Boolean, default: true },
//     water: { type: Boolean, default: true }
//   },
  
//   // Profile
//   profilePicture: String,
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   lastLogin: Date,
  
//   // Privacy
//   isPublic: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true
// });

// // Calculate BMR using Mifflin-St Jeor Equation
// userSchema.methods.calculateBMR = function() {
//   let bmr;
//   if (this.gender === 'male') {
//     bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) + 5;
//   } else {
//     bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) - 161;
//   }
//   return Math.round(bmr);
// };

// // Calculate TDEE based on activity level
// userSchema.methods.calculateTDEE = function() {
//   const bmr = this.calculateBMR();
//   const activityMultipliers = {
//     'sedentary': 1.2,
//     'light': 1.375,
//     'moderate': 1.55,
//     'active': 1.725,
//     'very_active': 1.9
//   };
//   return Math.round(bmr * activityMultipliers[this.activityLevel]);
// };

// // Calculate daily calorie target based on goal
// userSchema.methods.calculateDailyCalorieTarget = function() {
//   const tdee = this.calculateTDEE();
//   let target = tdee;
  
//   switch (this.fitnessGoal) {
//     case 'weight_loss':
//       target = tdee - 500; // 500 calorie deficit for 1 lb/week loss
//       break;
//     case 'muscle_gain':
//       target = tdee + 300; // 300 calorie surplus for muscle gain
//       break;
//     case 'maintenance':
//     case 'endurance':
//     case 'flexibility':
//     default:
//       target = tdee;
//       break;
//   }
//   return Math.max(1200, Math.round(target)); // Minimum 1200 calories
// };

// // Calculate daily water target
// userSchema.methods.calculateDailyWaterTarget = function() {
//   let baseWater = this.weight * 35; // 35ml per kg body weight
  
//   // Add extra for activity level
//   const activityBonus = {
//     'sedentary': 0,
//     'light': 250,
//     'moderate': 500,
//     'active': 750,
//     'very_active': 1000
//   };
  
//   return baseWater + activityBonus[this.activityLevel];
// };

// // Update calculated values and hash password before saving
// userSchema.pre('save', async function(next) {
//   // Update calculated values
//   this.bmr = this.calculateBMR();
//   this.tdee = this.calculateTDEE();
//   this.dailyCalorieTarget = this.calculateDailyCalorieTarget();
//   this.dailyWaterTarget = this.calculateDailyWaterTarget();
  
//   // Hash password if modified
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 12);
//   }
  
//   next();
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Get public profile
// userSchema.methods.getPublicProfile = function() {
//   return {
//     id: this._id,
//     name: this.name,
//     age: this.age,
//     fitnessGoal: this.fitnessGoal,
//     fitnessLevel: this.fitnessLevel,
//     profilePicture: this.profilePicture,
//     createdAt: this.createdAt
//   };
// };

// module.exports = mongoose.model('User', userSchema);




const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow empty string or valid phone number format
        return !v || /^[\+]?[(]?[\d\s\-\(\)]{10,}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Role and Access
  role: {
    type: String,
    enum: ['user', 'coach', 'admin'],
    default: 'user'
  },
  
  // Physical Information
  age: {
    type: Number,
    min: 10,
    max: 100
  },
  weight: {
    type: Number,
    min: 30,
    max: 300
  },
  height: {
    type: Number,
    min: 100,
    max: 250
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  
  // Fitness Information
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
  },
  fitnessGoal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'maintenance']
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  goals: [{
    type: String
  }], // Additional goals array for flexibility
  
  // Dietary Information
  dietaryPreference: {
    type: String,
    enum: ['balanced', 'keto', 'vegetarian', 'vegan', 'paleo', 'low_carb', 'mediterranean']
  },
  allergies: [{
    type: String
  }],
  
  // Health Information
  medicalConditions: [{
    type: String
  }],
  medications: [{
    type: String
  }],
  
  // Calculated Values
  bmr: Number, // Basal Metabolic Rate
  tdee: Number, // Total Daily Energy Expenditure
  dailyCalorieTarget: Number,
  dailyWaterTarget: Number, // in ml
  
  // Workout Preferences
  workoutDaysPerWeek: {
    type: Number,
    min: 1,
    max: 7,
    default: 3
  },
  workoutDuration: {
    type: Number,
    min: 15,
    max: 120,
    default: 45
  },
  availableEquipment: [{
    type: String,
    enum: ['none', 'dumbbells', 'barbell', 'resistance_bands', 'yoga_mat', 'cardio_machine', 'full_gym']
  }],
  
  // Settings and Preferences
  notifications: {
    email: { type: Boolean, default: true },
    workout: { type: Boolean, default: true },
    meal: { type: Boolean, default: true },
    water: { type: Boolean, default: true }
  },
  
  // Profile Information
  profilePicture: String,
  profilePic: String, // Alternative field name for compatibility
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  
  // Privacy Settings
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Coaching Related (if user is a coach)
  coachInfo: {
    specialties: [{
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'nutrition', 'cardio', 'strength_training', 'yoga', 'pilates', 'sports_specific']
    }],
    experience: {
      type: Number,
      min: 0
    },
    certifications: [{
      name: String,
      organization: String,
      dateObtained: Date,
      expiryDate: Date
    }],
    hourlyRate: {
      type: Number,
      min: 0
    },
    availability: {
      monday: [{ start: String, end: String }],
      tuesday: [{ start: String, end: String }],
      wednesday: [{ start: String, end: String }],
      thursday: [{ start: String, end: String }],
      friday: [{ start: String, end: String }],
      saturday: [{ start: String, end: String }],
      sunday: [{ start: String, end: String }]
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    },
    bio: String,
    isVerified: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Calculate BMR using Mifflin-St Jeor Equation
userSchema.methods.calculateBMR = function() {
  if (!this.weight || !this.height || !this.age || !this.gender) {
    return null;
  }
  
  let bmr;
  if (this.gender === 'male') {
    bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) + 5;
  } else {
    bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) - 161;
  }
  return Math.round(bmr);
};

// Calculate TDEE based on activity level
userSchema.methods.calculateTDEE = function() {
  const bmr = this.calculateBMR();
  if (!bmr || !this.activityLevel) return null;
  
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very_active': 1.9
  };
  return Math.round(bmr * activityMultipliers[this.activityLevel]);
};

// Calculate daily calorie target based on goal
userSchema.methods.calculateDailyCalorieTarget = function() {
  const tdee = this.calculateTDEE();
  if (!tdee || !this.fitnessGoal) return null;
  
  let target = tdee;
  
  switch (this.fitnessGoal) {
    case 'weight_loss':
      target = tdee - 500; // 500 calorie deficit for 1 lb/week loss
      break;
    case 'muscle_gain':
      target = tdee + 300; // 300 calorie surplus for muscle gain
      break;
    case 'maintenance':
    case 'endurance':
    case 'flexibility':
    default:
      target = tdee;
      break;
  }
  return Math.max(1200, Math.round(target)); // Minimum 1200 calories
};

// Calculate daily water target
userSchema.methods.calculateDailyWaterTarget = function() {
  if (!this.weight || !this.activityLevel) return null;
  
  let baseWater = this.weight * 35; // 35ml per kg body weight
  
  // Add extra for activity level
  const activityBonus = {
    'sedentary': 0,
    'light': 250,
    'moderate': 500,
    'active': 750,
    'very_active': 1000
  };
  
  return baseWater + activityBonus[this.activityLevel];
};

// Check if user is a coach
userSchema.methods.isCoach = function() {
  return this.role === 'coach';
};

// Check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Get profile picture (handles both field names)
userSchema.methods.getProfilePicture = function() {
  return this.profilePicture || this.profilePic || null;
};

// Update calculated values and hash password before saving
userSchema.pre('save', async function(next) {
  // Update calculated values only if required fields are present
  if (this.weight && this.height && this.age && this.gender && this.activityLevel) {
    this.bmr = this.calculateBMR();
    this.tdee = this.calculateTDEE();
    if (this.fitnessGoal) {
      this.dailyCalorieTarget = this.calculateDailyCalorieTarget();
    }
    this.dailyWaterTarget = this.calculateDailyWaterTarget();
  }
  
  // Hash password if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  const profile = {
    id: this._id,
    name: this.name,
    age: this.age,
    fitnessGoal: this.fitnessGoal,
    fitnessLevel: this.fitnessLevel,
    profilePicture: this.getProfilePicture(),
    role: this.role,
    createdAt: this.createdAt
  };

  // Add coach-specific information if user is a coach
  if (this.isCoach() && this.coachInfo) {
    profile.coachInfo = {
      specialties: this.coachInfo.specialties,
      experience: this.coachInfo.experience,
      rating: this.coachInfo.rating,
      bio: this.coachInfo.bio,
      isVerified: this.coachInfo.isVerified,
      hourlyRate: this.coachInfo.hourlyRate
    };
  }

  return profile;
};

// Get safe user data (excluding sensitive info)
userSchema.methods.getSafeUserData = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    age: this.age,
    gender: this.gender,
    fitnessLevel: this.fitnessLevel,
    fitnessGoal: this.fitnessGoal,
    goals: this.goals,
    profilePicture: this.getProfilePicture(),
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'coachInfo.specialties': 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);