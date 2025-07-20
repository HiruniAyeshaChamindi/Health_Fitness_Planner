const mongoose = require("mongoose")
require("dotenv").config()

// You'll need to create a Progress model based on your existing progress tracker
const Progress = require("../models/Progress") // Adjust path as needed

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const seedProgressData = async () => {
  try {
    console.log("🌱 Starting to seed progress data...")

    // Clear existing progress data
    await Progress.deleteMany({})

    // Get some user IDs (you can adjust these based on your actual user IDs)
    const User = require("../models/User")
    const users = await User.find({ role: "user" }).limit(3)

    if (users.length === 0) {
      console.log("❌ No users found. Please run the coaching data seed first.")
      return
    }

    const progressEntries = []

    // Generate progress data for each user
    for (let userIndex = 0; userIndex < users.length; userIndex++) {
      const user = users[userIndex]

      // Generate 30 days of progress data
      for (let day = 0; day < 30; day++) {
        const date = new Date()
        date.setDate(date.getDate() - (29 - day))

        // Simulate realistic progress trends
        const baseWeight = 75 - userIndex * 5 // Different starting weights
        const weightTrend = -0.1 * day + (Math.random() - 0.5) * 0.5 // Gradual weight loss with variation

        const baseFat = 20 - userIndex * 2
        const fatTrend = -0.05 * day + (Math.random() - 0.5) * 0.3

        const baseMuscle = 30 + userIndex * 2
        const muscleTrend = 0.02 * day + (Math.random() - 0.5) * 0.2

        progressEntries.push({
          userId: user._id,
          date: date.toISOString().split("T")[0],
          weight: Math.round((baseWeight + weightTrend) * 10) / 10,
          body_fat_percentage: Math.round((baseFat + fatTrend) * 10) / 10,
          muscle_mass: Math.round((baseMuscle + muscleTrend) * 10) / 10,
          water_intake: Math.floor(2000 + Math.random() * 1000), // 2000-3000ml
          workout_duration: Math.floor(30 + Math.random() * 60), // 30-90 minutes
          calories_consumed: Math.floor(1800 + Math.random() * 600), // 1800-2400 calories
          steps: Math.floor(5000 + Math.random() * 10000), // 5000-15000 steps
          sleep_hours: Math.round((6.5 + Math.random() * 2.5) * 2) / 2, // 6.5-9 hours
          mood: Math.floor(Math.random() * 5) + 1, // 1-5
          energy_level: Math.floor(Math.random() * 5) + 1, // 1-5
          stress_level: Math.floor(Math.random() * 5) + 1, // 1-5
          notes:
            day % 7 === 0
              ? [
                  "Great week! Feeling stronger and more energetic.",
                  "Had some challenges with cravings this week, but stayed on track overall.",
                  "Really enjoying the new workout routine. Seeing good progress!",
                  "Sleep has been better this week. Making a big difference in energy levels.",
                  "Meal prep on Sunday really helped me stay consistent this week.",
                ][Math.floor(Math.random() * 5)]
              : "",
          photos: [], // Empty for now, but structure is there
        })
      }
    }

    await Progress.insertMany(progressEntries)

    console.log("✅ Progress data seeded successfully!")
    console.log(`📊 Created ${progressEntries.length} progress entries for ${users.length} users`)
  } catch (error) {
    console.error("❌ Error seeding progress data:", error)
  } finally {
    mongoose.connection.close()
  }
}

// Run the seed function
seedProgressData()
