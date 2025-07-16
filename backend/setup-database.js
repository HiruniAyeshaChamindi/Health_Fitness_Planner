const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Database setup and seed script for FitGenie
async function setupDatabase() {
  try {
    console.log('🚀 Setting up FitGenie Database...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitgenie';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create indexes for better performance
    await User.createIndexes();
    console.log('✅ Database indexes created');

    // Create a demo user for testing (optional)
    const demoUserExists = await User.findOne({ email: 'demo@fitgenie.com' });
    
    if (!demoUserExists) {
      const hashedPassword = await bcrypt.hash('demo123', 12);
      
      const demoUser = new User({
        name: 'Demo User',
        email: 'demo@fitgenie.com',
        password: hashedPassword,
        age: 25,
        gender: 'male',
        height: 175,
        weight: 70,
        fitnessGoal: 'muscle_gain',
        fitnessLevel: 'intermediate',
        dietaryPreference: 'omnivore',
        workoutDuration: 45,
        dailyCalorieTarget: 2500,
        dailyWaterTarget: 2000,
        isVerified: true
      });

      await demoUser.save();
      console.log('✅ Demo user created: demo@fitgenie.com / demo123');
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with MongoDB connection string');
    console.log('2. Get Google Gemini API key from Google AI Studio');
    console.log('3. Configure email settings for plan delivery');
    console.log('4. Start the server with: npm start');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  setupDatabase();
}

module.exports = setupDatabase;
