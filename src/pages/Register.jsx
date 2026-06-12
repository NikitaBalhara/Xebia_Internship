import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearError, setAuth } from '../redux/slices/authSlice'
import { toast } from 'react-hot-toast'
import { Briefcase, Key, Mail, User as UserIcon, ShieldAlert } from 'lucide-react'

function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isAuthenticated, user, error, loading } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  })

  // Clear errors on load
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Handle successful registration
  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success(`Welcome to CareerGenie, ${user.name}!`)
      navigate(`/dashboard/${user.role}`)
    }
  }, [isAuthenticated, user, navigate])

  // Show registration errors
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validations
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return toast.error("Please fill in all fields")
    }
    
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long")
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match")
    }

    const dummyToken = 'dummy-token';
    const dummyUser = { id: '123', name: formData.name || 'Test User', email: formData.email, role: formData.role };
    dispatch(setAuth({ token: dummyToken, user: dummyUser }));
    toast.success(`Welcome to CareerGenie, ${dummyUser.name}!`);
    navigate('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8 glass rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-primary dark:text-blue-400">
            <Briefcase className="h-7 w-7" />
            <span>Career<span className="text-secondary dark:text-cyan-400">Genie</span></span>
          </Link>
          <h2 className="mt-6 text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Create a new account</h2>
          <p className="mt-2 text-xs text-slate-400">
            Or{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline dark:text-blue-400">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-3">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Sarah Jenkins"
                  className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2 pl-10 pr-4 text-xs shadow-sm focus:border-primary focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2 pl-10 pr-4 text-xs shadow-sm focus:border-primary focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Select Your Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2 pl-10 pr-4 text-xs shadow-sm focus:border-primary focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <option value="student">Student / Candidate</option>
                  <option value="recruiter">Recruiter / Coordinator</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Key className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="•••••••• (min 6 characters)"
                  className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2 pl-10 pr-4 text-xs shadow-sm focus:border-primary focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Key className="h-4 w-4" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2 pl-10 pr-4 text-xs shadow-sm focus:border-primary focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-dark disabled:opacity-75 mt-6"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
