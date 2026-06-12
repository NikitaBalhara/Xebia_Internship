import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Landing from './pages/Landing';
import StudentDashboard from './pages/StudentDashboard';
import ResumeAnalysis from './pages/ResumeAnalysis';
import ApplicationTracker from './pages/ApplicationTracker';
import JobBoard from './pages/JobBoard';
import JobDetails from './pages/JobDetails';
import MessagesInbox from './pages/MessagesInbox';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/analysis" element={<ResumeAnalysis />} />
          <Route path="/applications" element={<ApplicationTracker />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/messages" element={<MessagesInbox />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;