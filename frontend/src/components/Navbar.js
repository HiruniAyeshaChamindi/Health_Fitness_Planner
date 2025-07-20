// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { Menu, X, Dumbbell, User, LogOut, BarChart3, FileText, MessageCircle } from 'lucide-react';

// const Navbar = () => {
//   const { user, isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     setIsMenuOpen(false);
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const NavLink = ({ to, children, onClick }) => (
//     <Link
//       to={to}
//       onClick={() => {
//         setIsMenuOpen(false);
//         onClick && onClick();
//       }}
//       className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//     >
//       {children}
//     </Link>
//   );

//   return (
//     <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center space-x-2">
//               <Dumbbell className="h-8 w-8 text-primary-600" />
//               <span className="text-xl font-bold text-gray-900">FitGenie</span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             <NavLink to="/">Home</NavLink>
//             <NavLink to="/chatbot">AI Assistant</NavLink>
            
//             {isAuthenticated ? (
//               <>
//                 <NavLink to="/dashboard">Dashboard</NavLink>
//                 <NavLink to="/generate-plan">Generate Plan</NavLink>
//                 {/* <NavLink to="/my-plans">My Plans</NavLink> */}
//                 <NavLink to="/progress">Progress</NavLink>
                
//                 {/* User Menu */}
//                 <div className="relative ml-3">
//                   <div className="flex items-center space-x-2">
//                     <Link
//                       to="/profile"
//                       className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                     >
//                       <User className="h-4 w-4" />
//                       <span>{user?.name}</span>
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                     >
//                       <LogOut className="h-4 w-4" />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <NavLink to="/login">Login</NavLink>
//                 <Link
//                   to="/register"
//                   className="btn-primary btn-md"
//                 >
//                   Get Started
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={toggleMenu}
//               className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
//             <NavLink to="/">Home</NavLink>
//             <NavLink to="/chatbot">AI Assistant</NavLink>
            
//             {isAuthenticated ? (
//               <>
//                 <NavLink to="/dashboard">
//                   <div className="flex items-center space-x-2">
//                     <BarChart3 className="h-4 w-4" />
//                     <span>Dashboard</span>
//                   </div>
//                 </NavLink>
//                 <NavLink to="/generate-plan">Generate Plan</NavLink>
//                 <NavLink to="/my-plans">
//                   <div className="flex items-center space-x-2">
//                     <FileText className="h-4 w-4" />
//                     <span>My Plans</span>
//                   </div>
//                 </NavLink>
//                 <NavLink to="/progress">Progress</NavLink>
//                 <NavLink to="/profile">
//                   <div className="flex items-center space-x-2">
//                     <User className="h-4 w-4" />
//                     <span>Profile</span>
//                   </div>
//                 </NavLink>
                
//                 <div className="border-t pt-2">
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center space-x-2 w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//                   >
//                     <LogOut className="h-4 w-4" />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <NavLink to="/login">Login</NavLink>
//                 <NavLink to="/register">Register</NavLink>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;








///**********With Coaching Feature */

"use client"

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Menu, X, Dumbbell, User, LogOut, BarChart3, MessageCircle, Users, Calendar, Award } from "lucide-react"

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={() => {
        setIsMenuOpen(false)
        onClick && onClick()
      }}
      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  )

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">FitGenie</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/chatbot">AI Assistant</NavLink>
            <NavLink to="/coaches">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Find Coaches</span>
              </div>
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/generate-plan">Generate Plan</NavLink>
                <NavLink to="/progress">Progress</NavLink>

                {/* Coaching Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>Coaching</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/dashboard/requests"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        My Requests
                      </Link>
                      <Link
                        to="/dashboard/coaching"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Active Coaching
                      </Link>
                      <Link
                        to="/become-coach"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Become a Coach
                      </Link>
                    </div>
                  </div>
                </div>

                {/* User Menu */}
                <div className="relative ml-3">
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>{user?.name}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link to="/register" className="btn-primary btn-md">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/chatbot">AI Assistant</NavLink>
            <NavLink to="/coaches">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Find Coaches</span>
              </div>
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                </NavLink>
                <NavLink to="/generate-plan">Generate Plan</NavLink>
                <NavLink to="/progress">Progress</NavLink>

                {/* Coaching Section */}
                <div className="border-t pt-2 mt-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Coaching</div>
                  <NavLink to="/dashboard/requests">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>My Requests</span>
                    </div>
                  </NavLink>
                  <NavLink to="/dashboard/coaching">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Active Coaching</span>
                    </div>
                  </NavLink>
                  <NavLink to="/become-coach">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>Become a Coach</span>
                    </div>
                  </NavLink>
                </div>

                <NavLink to="/profile">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </NavLink>

                <div className="border-t pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
