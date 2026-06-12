import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth, clearError } from '../redux/slices/authSlice'
import { toast } from 'react-hot-toast'
import { Briefcase, Key, Mail, Eye, EyeOff } from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')

  const { isAuthenticated, user, error, loading } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  // Clear errors on load
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success(`Welcome back, ${user.name}!`)
      if (redirect === 'resume') {
        navigate('/resume')
      } else {
        navigate(`/dashboard/${user.role}`)
      }
    }
  }, [isAuthenticated, user, navigate, redirect])

  // Show login errors
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
    if (!formData.email || !formData.password) {
      return toast.error("Please fill in all fields")
    }
    const dummyToken = 'dummy-token';
    const dummyUser = { id: '123', name: 'Test User', email: formData.email, role: 'student' };
    dispatch(setAuth({ token: dummyToken, user: dummyUser }));
    toast.success(`Welcome back, ${dummyUser.name}!`);
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
          <h2 className="mt-6 text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Sign in to your account</h2>
          <p className="mt-2 text-xs text-slate-400">
            Or{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline dark:text-blue-400">
              create a new account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
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
                  className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-xs shadow-sm focus:border-primary focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                />
              </div>
            </div>

            {/* Password Field */}
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-200 bg-white/50 py-2.5 pl-10 pr-10 text-xs shadow-sm focus:border-primary focus:outline-none dark:border-slate-800 dark:bg-slate-900/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-800 dark:bg-slate-900"
              />
              <label htmlFor="remember-me" className="ml-2 font-medium text-slate-500 dark:text-slate-400">
                Remember me
              </label>
            </div>
            <a href="#" className="font-semibold text-primary hover:underline dark:text-blue-400">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-dark disabled:opacity-75"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
