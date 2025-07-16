@echo off
echo 🏋️‍♂️ FitGenie Setup Script
echo ==========================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo 🔧 Setting up backend environment...
if not exist .env (
    echo Creating .env file for backend...
    echo NODE_ENV=development > .env
    echo PORT=5000 >> .env
    echo MONGODB_URI=mongodb://localhost:27017/fitgenie >> .env
    echo JWT_SECRET=your_super_secret_jwt_key_here_change_in_production >> .env
    echo GOOGLE_API_KEY=your_google_gemini_api_key_here >> .env
    echo EMAIL_HOST=smtp.gmail.com >> .env
    echo EMAIL_PORT=587 >> .env
    echo EMAIL_USER=your_email@gmail.com >> .env
    echo EMAIL_PASS=your_app_password >> .env
    echo FRONTEND_URL=http://localhost:3000 >> .env
)

echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo 🔧 Setting up frontend environment...
if not exist .env (
    echo REACT_APP_API_URL=http://localhost:5000/api > .env
)

echo ✅ Setup complete!
echo.
echo 🚀 To start the application:
echo 1. Backend: cd backend ^&^& npm run dev
echo 2. Frontend: cd frontend ^&^& npm start
echo.
echo 📝 Don't forget to:
echo - Add your Google Gemini API key to backend\.env
echo - Configure MongoDB connection in backend\.env
echo - Set up email credentials for plan delivery

pause
