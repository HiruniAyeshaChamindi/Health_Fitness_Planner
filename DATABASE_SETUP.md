# 🗄️ FitGenie Database Setup Guide

## MongoDB Atlas Setup (Recommended for IDEALIZE 2025)

### Step 1: Create MongoDB Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Create a new project called "FitGenie"

### Step 2: Create Database Cluster
1. Click "Build a Database"
2. Choose **"FREE"** shared cluster (M0 Sandbox)
3. Select cloud provider and region (choose closest to your location)
4. Name your cluster: `fitgenie-cluster`
5. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Configure Database Access
1. **Create Database User:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `fitgenie_user`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

2. **Configure Network Access:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - For development: Add "0.0.0.0/0" (allows access from anywhere)
   - For production: Add your specific IP addresses
   - Click "Confirm"

### Step 4: Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://fitgenie_user:<password>@fitgenie-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Configure Your Application
1. Create `.env` file in `/backend` directory:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your MongoDB connection:
   ```env
   MONGODB_URI=mongodb+srv://fitgenie_user:YOUR_PASSWORD@fitgenie-cluster.xxxxx.mongodb.net/fitgenie?retryWrites=true&w=majority
   ```

3. Replace `YOUR_PASSWORD` with the password you created
4. Add `/fitgenie` at the end to specify the database name

### Step 6: Test Database Connection
```bash
cd backend
npm run setup-db
```

## Alternative: Local MongoDB Installation

### For Windows:
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will run as a Windows Service
4. Use connection string: `mongodb://localhost:27017/fitgenie`

### For macOS:
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### For Linux (Ubuntu):
```bash
# Import MongoDB public GPG Key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Database Schema Overview

Your FitGenie app uses these main collections:

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  fitnessGoal: String,
  fitnessLevel: String,
  dietaryPreference: String,
  medicalConditions: String,
  workoutDuration: Number,
  dailyCalorieTarget: Number,
  dailyWaterTarget: Number,
  bmr: Number (calculated),
  tdee: Number (calculated),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Health Plans Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  plan_name: String,
  plan_type: String,
  workout_plan: {
    exercises: Array,
    duration: Number,
    intensity: String
  },
  meal_plan: {
    meals: Array,
    total_nutrition: Object
  },
  ai_recommendations: String,
  lifestyle_tips: Array,
  user_feedback: {
    rating: Number,
    comments: String
  },
  is_active: Boolean,
  created_at: Date
}
```

### 3. Progress Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  date: Date,
  weight: Number,
  body_fat_percentage: Number,
  muscle_mass: Number,
  water_intake: Number,
  workout_duration: Number,
  calories_consumed: Number,
  notes: String,
  created_at: Date
}
```

## Required Environment Variables

Create a `.env` file in your `/backend` directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=fitgenie_super_secret_jwt_key_for_idealize_2025
JWT_EXPIRE=7d

# AI Service
GOOGLE_API_KEY=your_google_gemini_api_key

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# App Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3001
```

## Testing Your Database Setup

1. **Start your backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Check the console output:**
   - Should see: "✅ Connected to MongoDB"
   - Should see: "FitGenie Backend Server running on port 5000"

3. **Test with demo user:**
   - Email: `demo@fitgenie.com`
   - Password: `demo123`

## Database Management Tools

### MongoDB Compass (GUI)
- Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
- Connect using your connection string
- Visual interface for viewing and editing data

### VS Code Extension
- Install "MongoDB for VS Code" extension
- Connect and manage your database directly in VS Code

## For IDEALIZE 2025 Competition

**Recommended Setup:**
1. ✅ Use MongoDB Atlas (free tier)
2. ✅ Store connection string securely
3. ✅ Include demo data for judges to test
4. ✅ Document your database schema in README
5. ✅ Ensure your app works with sample data

## Troubleshooting

### Common Issues:

1. **Connection Timeout:**
   - Check network access settings in MongoDB Atlas
   - Ensure your IP is whitelisted

2. **Authentication Failed:**
   - Verify username and password in connection string
   - Check database user permissions

3. **Database Not Found:**
   - MongoDB creates databases automatically when first document is inserted
   - Make sure database name is specified in connection string

## Need Help?

If you encounter any issues:
1. Check MongoDB Atlas logs
2. Review your connection string format
3. Ensure all environment variables are set
4. Test connection with MongoDB Compass first

Your FitGenie app is now ready with a professional database setup! 🚀
