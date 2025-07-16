# FitGenie - AI Health & Fitness Planner

🏋️‍♂️ **A comprehensive MERN stack application with AI-powered personalized health and fitness planning**

## 🌟 Project Overview

FitGenie is an innovative web application that leverages Google Gemini AI to create personalized workout routines and meal plans. Built for the IDEALIZE 2025 competition by Team Bits from University of Moratuwa.

### 🎯 Key Features

- **AI-Powered Plan Generation**: Personalized workout and meal plans using Google Gemini
- **Interactive Dashboard**: Real-time progress tracking with charts and analytics
- **Chatbot Integration**: 24/7 AI assistant for health and fitness guidance
- **Progress Tracking**: Comprehensive logging of workouts, meals, and body measurements
- **PDF Generation**: Downloadable plans for offline access
- **Email Integration**: Plans delivered directly to your inbox
- **Water Intake Tracker**: Daily hydration goal monitoring
- **BMR/TDEE Calculator**: Metabolic rate calculations for accurate calorie targets
- **Mobile Responsive**: Optimized for all device sizes

## 🏗️ Technology Stack

### Frontend
- **React.js 18** - Modern UI library
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Google Gemini AI** - AI model integration
- **PDFKit** - PDF generation
- **Nodemailer** - Email functionality

### AI & Services
- **Google Gemini Pro** - Text generation and planning
- **DuckDuckGo Search** - Web search capabilities (Python version)
- **Real-time data integration** - Live health information

## 📁 Project Structure

```
Health_Fitness_Planner/
├── backend/                 # Node.js Express server
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── services/           # AI and external services
│   ├── middleware/         # Authentication & validation
│   ├── .env               # Environment variables
│   ├── server.js          # Main server file
│   └── package.json       # Dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── App.js         # Main app component
│   ├── public/            # Static assets
│   ├── tailwind.config.js # Tailwind configuration
│   └── package.json       # Dependencies
├── GenAI_Health_Fitness_Planner/ # Original Python version
│   ├── fitness.py         # Streamlit app
│   ├── pdf_email_features.py
│   └── tracking_features.py
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free) OR local MongoDB installation
- Google Gemini API key
- Gmail account (for email features)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://sandali:sandali123@cluster0.0nq0cis.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=fitgenie_super_secret_jwt_key_for_idealize_2025
GOOGLE_API_KEY=your_google_gemini_api_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=jayawardhanasandali2@gmail.com
EMAIL_PASS=Sandali123
FRONTEND_URL=http://localhost:3001
```

**📋 Database Setup:**
- **Option 1 (Recommended):** MongoDB Atlas - See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed instructions
- **Option 2:** Local MongoDB installation

4. **Setup database and test connection**
```bash
npm run setup-db
```bash
npm start          # Production
npm run dev        # Development with nodemon
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Health Plans
- `POST /api/plans/generate` - Generate new health plan
- `GET /api/plans` - Get user's plans
- `GET /api/plans/:id` - Get specific plan
- `GET /api/plans/:id/pdf` - Download plan as PDF
- `POST /api/plans/:id/email` - Email plan to user

### Progress Tracking
- `POST /api/progress` - Log daily progress
- `GET /api/progress` - Get progress history
- `GET /api/progress/analytics` - Get analytics
- `GET /api/progress/today` - Get today's progress

### Chatbot
- `POST /api/chatbot/chat` - Chat with AI assistant
- `GET /api/chatbot/tips` - Get fitness tips
- `POST /api/chatbot/calculate` - Calculate BMR/TDEE

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/settings` - Update settings

## 🤖 AI Integration

### Google Gemini AI Features
- **Meal Plan Generation**: Personalized nutrition plans based on user profile
- **Workout Plan Generation**: Custom exercise routines for all fitness levels
- **Chatbot Responses**: Intelligent health and fitness guidance
- **Lifestyle Tips**: Personalized recommendations for healthy living

### AI Prompt Engineering
The application uses carefully crafted prompts to ensure:
- Accurate nutritional information
- Safe exercise recommendations
- Personalized responses based on user data
- Medical disclaimer when appropriate

## 📱 Key Components

### Dashboard
- Quick stats overview
- Today's plan summary
- Progress charts
- Motivational messages

### Plan Generator
- Step-by-step profile setup
- AI-powered plan generation
- Instant plan preview
- Plan customization options

### Progress Tracker
- Daily activity logging
- Photo progress tracking
- Analytics and insights
- Goal achievement monitoring

### AI Chatbot
- Natural language processing
- Context-aware responses
- Health information lookup
- Motivation and support

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- Helmet.js security headers
- CORS configuration

## 📊 Database Schema

### User Model
- Personal information (age, weight, height, gender)
- Fitness preferences and goals
- Calculated metrics (BMR, TDEE, calorie targets)
- Settings and preferences

### Health Plan Model
- Workout plan with exercises
- Meal plan with nutrition
- AI recommendations
- User feedback and ratings

### Progress Model
- Daily activity logs
- Measurements and photos
- Goal completion tracking
- Analytics data

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern Animations**: Smooth transitions with Framer Motion
- **Accessible**: WCAG compliant components
- **Dark Mode Ready**: Tailwind CSS configuration
- **Interactive Charts**: Real-time data visualization

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Add environment variables to your platform
# Deploy using Git or platform-specific CLI
```

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the build folder
```

### Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas
- Update MONGODB_URI in environment variables

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Team Bits

- **M.G.H.A Chamindi** - University of Moratuwa - hiruni.22@cse.mrt.ac.lk
- **K.Y.T. Wickramasinghe** - University of Moratuwa - yashodha.22@cse.mrt.ac.lk
- **M.D.S Gangadari** - University of Moratuwa - sansala.22@cse.mrt.ac.lk
- **W.S.S Jayawardhana** - University of Moratuwa - jayawardhanasandali2@gmail.com
- **Dulakshi Chamodya Abeynayake** - University of Moratuwa - dulakshi.22@cse.mrt.ac.lk

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 IDEALIZE 2025

This project was developed for the IDEALIZE 2025 competition organized by AIESEC in University of Moratuwa.

**Category**: Web Application  
**Field**: Healthcare and Medicine  
**Application Name**: FitGenie

## 📞 Support

For support, email us at [team.bits.fitgenie@gmail.com](mailto:team.bits.fitgenie@gmail.com) or create an issue in this repository.

---

**Built with ❤️ by Team Bits for IDEALIZE 2025**