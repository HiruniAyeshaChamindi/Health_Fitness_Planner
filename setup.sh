#!/bin/bash

echo "🏋️‍♂️ FitGenie Setup Script"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional - can use Atlas)
if ! command -v mongod &> /dev/null; then
    echo "⚠️ MongoDB is not installed locally. Make sure to use MongoDB Atlas or install MongoDB."
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🔧 Setting up backend environment..."
if [ ! -f .env ]; then
    echo "Creating .env file for backend..."
    cp .env.example .env 2>/dev/null || echo "Please create .env file manually using the template in README.md"
fi

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🔧 Setting up frontend environment..."
if [ ! -f .env ]; then
    echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "📝 Don't forget to:"
echo "- Add your Google Gemini API key to backend/.env"
echo "- Configure MongoDB connection in backend/.env"
echo "- Set up email credentials for plan delivery"
