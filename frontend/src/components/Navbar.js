import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Dumbbell, User, LogOut, BarChart3, FileText, MessageCircle, ChevronDown, BookOpen, Mail, Info } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = React.useState(false);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isResourcesDropdownOpen && !event.target.closest('.resources-dropdown')) {
        setIsResourcesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isResourcesDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleResourcesDropdown = () => {
    setIsResourcesDropdownOpen(!isResourcesDropdownOpen);
  };

  const closeDropdowns = () => {
    setIsResourcesDropdownOpen(false);
  };

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={() => {
        setIsMenuOpen(false);
        closeDropdowns();
        onClick && onClick();
      }}
      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  );

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
            
            {/* Resources Dropdown */}
            <div className="relative resources-dropdown">
              <button
                onClick={toggleResourcesDropdown}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Resources</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isResourcesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isResourcesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <Link
                      to="/contact"
                      onClick={closeDropdowns}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Contact</span>
                    </Link>
                    <Link
                      to="/blog"
                      onClick={closeDropdowns}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Blog</span>
                    </Link>
                    <Link
                      to="/about"
                      onClick={closeDropdowns}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                    >
                      <Info className="h-4 w-4" />
                      <span>About</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/generate-plan">Generate Plan</NavLink>
                <NavLink to="/my-plans">My Plans</NavLink>
                <NavLink to="/progress">Progress</NavLink>
                
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
                <Link
                  to="/register"
                  className="btn-primary btn-md"
                >
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
            
            {/* Mobile Resources Section */}
            <div className="border-t pt-2 mt-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                Resources
              </div>
              <NavLink to="/contact">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact</span>
                </div>
              </NavLink>
              <NavLink to="/blog">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Blog</span>
                </div>
              </NavLink>
              <NavLink to="/about">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4" />
                  <span>About</span>
                </div>
              </NavLink>
            </div>
            
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                </NavLink>
                <NavLink to="/generate-plan">Generate Plan</NavLink>
                <NavLink to="/my-plans">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>My Plans</span>
                  </div>
                </NavLink>
                <NavLink to="/progress">Progress</NavLink>
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
  );
};

export default Navbar;
