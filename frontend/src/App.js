// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './contexts/AuthContext';
// import Navbar from './components/Navbar';
// import LoadingSpinner from './components/LoadingSpinner';

// // Pages
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import PlanGenerator from './pages/PlanGenerator';
// import MyPlans from './pages/MyPlans';
// import Progress from './pages/Progress';
// import Chatbot from './pages/Chatbot';
// import Profile from './pages/Profile';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();
  
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }
  
//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// // Public Route Component (redirect if authenticated)
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();
  
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }
  
//   return !isAuthenticated ? children : <Navigate to="/dashboard" />;
// };

// function App() {
//   const { isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="pt-16"> {/* Account for fixed navbar */}
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Home />} />
//           <Route 
//             path="/login" 
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             } 
//           />
//           <Route 
//             path="/register" 
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             } 
//           />
          
//           {/* Protected Routes */}
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/generate-plan" 
//             element={
//               <ProtectedRoute>
//                 <PlanGenerator />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/my-plans" 
//             element={
//               <ProtectedRoute>
//                 <MyPlans />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/progress" 
//             element={
//               <ProtectedRoute>
//                 <Progress />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/profile" 
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             } 
//           />
          
//           {/* Chatbot - accessible to all */}
//           <Route path="/chatbot" element={<Chatbot />} />
          
//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default App;




//**********After Coaching Features */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Existing pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PlanGenerator from './pages/PlanGenerator';
import MyPlans from './pages/MyPlans';
import Progress from './pages/Progress';
import Chatbot from './pages/Chatbot';
import Profile from './pages/Profile';

// New coaching pages
import CoachDiscovery from './pages/CoachDiscovery';
import CoachProfile from './pages/CoachProfile';
import CoachingRequest from './pages/CoachingRequest';
import UserRequests from './pages/UserRequests';
import ActiveCoaching from './pages/ActiveCoaching';
import BecomeCoach from './pages/BecomeCoach';
import CoachDashboard from './pages/CoachDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16"> {/* Account for fixed navbar */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Coach discovery - public */}
          <Route path="/coaches" element={<CoachDiscovery />} />
          <Route path="/coaches/:id" element={<CoachProfile />} />

          {/* Chatbot - accessible to all */}
          <Route path="/chatbot" element={<Chatbot />} />

          {/* Protected Routes - Main App */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/generate-plan" 
            element={
              <ProtectedRoute>
                <PlanGenerator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-plans" 
            element={
              <ProtectedRoute>
                <MyPlans />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Coaching Routes - Protected */}
          <Route 
            path="/coaches/:id/request" 
            element={
              <ProtectedRoute>
                <CoachingRequest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/requests" 
            element={
              <ProtectedRoute>
                <UserRequests />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/coaching" 
            element={
              <ProtectedRoute>
                <ActiveCoaching />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/become-coach" 
            element={
              <ProtectedRoute>
                <BecomeCoach />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/coach-dashboard" 
            element={
              <ProtectedRoute>
                <CoachDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;