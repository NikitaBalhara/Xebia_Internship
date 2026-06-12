import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Briefcase, Menu, X, Moon, Sun } from 'lucide-react';

function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <Briefcase className="h-6 w-6" />
            <span>CareerGenie</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">Dashboard</Link>
            <Link to="/jobs" className="text-gray-600 hover:text-indigo-600 font-medium">Jobs</Link>
            <Link to="/analysis" className="text-gray-600 hover:text-indigo-600 font-medium">Analysis</Link>
            <Link to="/applications" className="text-gray-600 hover:text-indigo-600 font-medium">Applications</Link>
            <Link to="/messages" className="text-gray-600 hover:text-indigo-600 font-medium">Messages</Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>

            {/* ✅ Redux isAuthenticated se check */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.name && (
                  <span className="text-sm font-medium text-gray-600">Hi, {user.name}!</span>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-600 font-medium hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 font-medium hover:text-indigo-600">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4">
          <Link to="/dashboard" className="block py-2">Dashboard</Link>
          <Link to="/jobs" className="block py-2">Jobs</Link>
          <Link to="/analysis" className="block py-2">Analysis</Link>
          <Link to="/applications" className="block py-2">Applications</Link>
          <Link to="/messages" className="block py-2">Messages</Link>
          <hr className="my-2" />
          {isAuthenticated ? (
            <button onClick={handleLogout} className="block py-2 text-red-600 font-medium">Logout</button>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-indigo-600">Login</Link>
              <Link to="/register" className="block py-2 font-bold text-indigo-600">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;