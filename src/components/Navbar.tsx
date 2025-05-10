import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, Menu, X, LogOut, History, ChevronDown } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setProfileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-secondary-900/95 backdrop-blur-sm shadow-lg z-50 border-b border-secondary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Car className="h-8 w-8 text-primary-400 group-hover:text-primary-300 transition-colors duration-200" />
              <span className="text-xl font-bold text-white">RideShare</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={user?.type === 'driver' ? '/driver/dashboard' : '/rider/dashboard'} className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md font-medium transition-colors duration-200">
                  Dashboard
                </Link>
                {user?.type === 'rider' && (
                  <Link to="/book" className="bg-primary-500 text-secondary-900 px-4 py-2 rounded-md font-medium hover:bg-primary-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Book a Ride
                  </Link>
                )}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md font-medium transition-colors duration-200"
                    onClick={toggleProfileMenu}
                  >
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-500"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-secondary-800 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-400" />
                      </div>
                    )}
                    <span className="text-white">{user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-secondary-800 rounded-lg shadow-xl py-1 z-50 ring-1 ring-secondary-700 border border-secondary-700">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-secondary-700 hover:text-primary-400 transition-colors duration-200"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      <Link 
                        to="/history" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-secondary-700 hover:text-primary-400 transition-colors duration-200"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <History className="h-4 w-4" />
                          <span>Ride History</span>
                        </div>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-secondary-700 hover:text-red-400 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link to="/signup" className="bg-primary-500 text-secondary-900 px-4 py-2 rounded-md font-medium hover:bg-primary-400 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-primary-400 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-secondary-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-2">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-500"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-secondary-700 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-400" />
                    </div>
                  )}
                  <span className="font-medium text-white">{user?.name}</span>
                </div>
                <Link 
                  to={user?.type === 'driver' ? '/driver/dashboard' : '/rider/dashboard'}
                  className="block px-3 py-2 rounded-md text-gray-300 font-medium hover:bg-secondary-700 hover:text-primary-400"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {user?.type === 'rider' && (
                  <Link 
                    to="/book" 
                    className="block px-3 py-2 rounded-md bg-primary-500 text-secondary-900 font-medium hover:bg-primary-400"
                    onClick={() => setIsOpen(false)}
                  >
                    Book a Ride
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-gray-300 font-medium hover:bg-secondary-700 hover:text-primary-400"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/history" 
                  className="block px-3 py-2 rounded-md text-gray-300 font-medium hover:bg-secondary-700 hover:text-primary-400"
                  onClick={() => setIsOpen(false)}
                >
                  Ride History
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-gray-300 font-medium hover:bg-secondary-700 hover:text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-gray-300 font-medium hover:bg-secondary-700 hover:text-primary-400"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-3 py-2 rounded-md bg-primary-500 text-secondary-900 font-medium hover:bg-primary-400"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;