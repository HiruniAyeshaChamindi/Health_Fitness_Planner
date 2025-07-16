const { ProgressEntry, WeeklyProgress } = require('../models/Progress');
const User = require('../models/User');

// Log daily progress
const logDailyProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      date,
      weight,
      body_fat_percentage,
      measurements,
      workouts_completed,
      meals_logged,
      water_intake,
      sleep,
      energy_level,
      mood,
      daily_goals,
      notes,
      progress_photos
    } = req.body;

    // Check if entry already exists for this date
    const existingEntry = await ProgressEntry.findOne({
      user: userId,
      date: new Date(date).toDateString()
    });

    if (existingEntry) {
      // Update existing entry
      Object.assign(existingEntry, req.body);
      await existingEntry.save();
      
      return res.json({
        success: true,
        message: 'Progress updated successfully',
        progress: existingEntry
      });
    }

    // Create new progress entry
    const progressEntry = new ProgressEntry({
      user: userId,
      date: date || new Date(),
      weight,
      body_fat_percentage,
      measurements,
      workouts_completed: workouts_completed || [],
      meals_logged: meals_logged || [],
      water_intake,
      sleep,
      energy_level,
      mood,
      daily_goals,
      notes,
      progress_photos: progress_photos || []
    });

    await progressEntry.save();

    res.status(201).json({
      success: true,
      message: 'Progress logged successfully',
      progress: progressEntry
    });

  } catch (error) {
    console.error('Error logging progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log progress',
      error: error.message
    });
  }
};

// Get progress history
const getProgressHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      startDate, 
      endDate, 
      limit = 30,
      page = 1 
    } = req.query;

    // Build query
    const query = { user: userId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const progressEntries = await ProgressEntry.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ProgressEntry.countDocuments(query);

    res.json({
      success: true,
      progress: progressEntries,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching progress history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress history',
      error: error.message
    });
  }
};

// Get progress analytics
const getProgressAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30' } = req.query; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const progressEntries = await ProgressEntry.find({
      user: userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Calculate analytics
    const analytics = {
      totalDays: progressEntries.length,
      weightProgress: calculateWeightProgress(progressEntries),
      workoutConsistency: calculateWorkoutConsistency(progressEntries),
      nutritionConsistency: calculateNutritionConsistency(progressEntries),
      waterIntakeAverage: calculateWaterIntakeAverage(progressEntries),
      sleepAnalytics: calculateSleepAnalytics(progressEntries),
      energyTrends: calculateEnergyTrends(progressEntries),
      goalAchievementRate: calculateGoalAchievementRate(progressEntries),
      weeklyAverages: calculateWeeklyAverages(progressEntries)
    };

    res.json({
      success: true,
      analytics,
      period: `${period} days`
    });

  } catch (error) {
    console.error('Error calculating analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate analytics',
      error: error.message
    });
  }
};

// Helper functions for analytics
function calculateWeightProgress(entries) {
  const weights = entries.filter(e => e.weight).map(e => ({ date: e.date, weight: e.weight }));
  if (weights.length < 2) return null;

  const startWeight = weights[0].weight;
  const currentWeight = weights[weights.length - 1].weight;
  const change = currentWeight - startWeight;

  return {
    startWeight,
    currentWeight,
    change,
    trend: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
    dataPoints: weights
  };
}

function calculateWorkoutConsistency(entries) {
  const workoutDays = entries.filter(e => e.daily_goals?.workout_completed).length;
  const totalDays = entries.length;
  
  return {
    workoutDays,
    totalDays,
    consistency: totalDays > 0 ? Math.round((workoutDays / totalDays) * 100) : 0
  };
}

function calculateNutritionConsistency(entries) {
  const nutritionDays = entries.filter(e => e.daily_goals?.meal_plan_followed).length;
  const totalDays = entries.length;
  
  return {
    nutritionDays,
    totalDays,
    consistency: totalDays > 0 ? Math.round((nutritionDays / totalDays) * 100) : 0
  };
}

function calculateWaterIntakeAverage(entries) {
  const waterEntries = entries.filter(e => e.water_intake?.actual);
  if (waterEntries.length === 0) return null;

  const total = waterEntries.reduce((sum, e) => sum + e.water_intake.actual, 0);
  const average = total / waterEntries.length;

  return {
    average: Math.round(average),
    entries: waterEntries.length,
    totalDays: entries.length
  };
}

function calculateSleepAnalytics(entries) {
  const sleepEntries = entries.filter(e => e.sleep?.hours_slept);
  if (sleepEntries.length === 0) return null;

  const totalHours = sleepEntries.reduce((sum, e) => sum + e.sleep.hours_slept, 0);
  const averageHours = totalHours / sleepEntries.length;

  const qualityEntries = sleepEntries.filter(e => e.sleep.quality_rating);
  const averageQuality = qualityEntries.length > 0 
    ? qualityEntries.reduce((sum, e) => sum + e.sleep.quality_rating, 0) / qualityEntries.length 
    : null;

  return {
    averageHours: Math.round(averageHours * 10) / 10,
    averageQuality: averageQuality ? Math.round(averageQuality * 10) / 10 : null,
    entries: sleepEntries.length
  };
}

function calculateEnergyTrends(entries) {
  const energyEntries = entries.filter(e => e.energy_level);
  if (energyEntries.length === 0) return null;

  const average = energyEntries.reduce((sum, e) => sum + e.energy_level, 0) / energyEntries.length;
  
  return {
    average: Math.round(average * 10) / 10,
    trend: calculateTrend(energyEntries.map(e => e.energy_level)),
    entries: energyEntries.length
  };
}

function calculateGoalAchievementRate(entries) {
  if (entries.length === 0) return null;

  const achievements = entries.map(e => e.getDailyGoalCompletion());
  const average = achievements.reduce((sum, rate) => sum + rate, 0) / achievements.length;

  return {
    average: Math.round(average),
    dataPoints: entries.map(e => ({
      date: e.date,
      completion: e.getDailyGoalCompletion()
    }))
  };
}

function calculateWeeklyAverages(entries) {
  const weeks = {};
  
  entries.forEach(entry => {
    const weekStart = getWeekStart(entry.date);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        weekStart,
        entries: []
      };
    }
    
    weeks[weekKey].entries.push(entry);
  });

  return Object.values(weeks).map(week => ({
    weekStart: week.weekStart,
    averageWeight: calculateAverage(week.entries, 'weight'),
    workoutDays: week.entries.filter(e => e.daily_goals?.workout_completed).length,
    averageEnergy: calculateAverage(week.entries, 'energy_level'),
    averageSleep: calculateAverage(week.entries, e => e.sleep?.hours_slept)
  }));
}

function calculateTrend(values) {
  if (values.length < 2) return 'stable';
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const diff = secondAvg - firstAvg;
  return diff > 0.5 ? 'increasing' : diff < -0.5 ? 'decreasing' : 'stable';
}

function calculateAverage(entries, field) {
  const values = entries.map(e => typeof field === 'function' ? field(e) : e[field])
    .filter(v => v != null && !isNaN(v));
  
  return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

// Update daily goals
const updateDailyGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, goals } = req.body;

    const progressEntry = await ProgressEntry.findOneAndUpdate(
      { 
        user: userId, 
        date: new Date(date).toDateString() 
      },
      { daily_goals: goals },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Daily goals updated successfully',
      progress: progressEntry
    });

  } catch (error) {
    console.error('Error updating daily goals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update daily goals',
      error: error.message
    });
  }
};

// Get today's progress
const getTodayProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toDateString();

    let progressEntry = await ProgressEntry.findOne({
      user: userId,
      date: today
    });

    // If no entry exists for today, create a basic one
    if (!progressEntry) {
      progressEntry = new ProgressEntry({
        user: userId,
        date: new Date(),
        daily_goals: {
          workout_completed: false,
          meal_plan_followed: false,
          water_goal_met: false,
          sleep_goal_met: false
        }
      });
      await progressEntry.save();
    }

    res.json({
      success: true,
      progress: progressEntry
    });

  } catch (error) {
    console.error('Error fetching today\'s progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s progress',
      error: error.message
    });
  }
};

module.exports = {
  logDailyProgress,
  getProgressHistory,
  getProgressAnalytics,
  updateDailyGoals,
  getTodayProgress
};
