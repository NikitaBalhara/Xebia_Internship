import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../services/api'

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post('/api/auth/register', userData)
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/api/auth/login', credentials)
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login failed')
    }
  }
)

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/api/auth/me')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load user')
    }
  }
)

export const updateStudentProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await API.put('/api/auth/profile', profileData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile')
    }
  }
)

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  profile: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { token, user } = action.payload
      localStorage.setItem('token', token)
      state.token = token
      state.isAuthenticated = true
      state.user = user
    },
    logout: (state) => {
      localStorage.removeItem('token')
      state.token = null
      state.isAuthenticated = false
      state.user = null
      state.profile = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Load User — ✅ naam preserve karo
      .addCase(loadUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        const newUser = action.payload.user || action.payload.data
        state.user = {
          ...state.user,
          ...newUser,
          name: newUser?.name || state.user?.name
        }
        state.profile = action.payload.profile || null
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = !!localStorage.getItem('token')
        // ✅ User null mat karo — naam bachao
      })

      // Update Profile
      .addCase(updateStudentProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateStudentProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload.profile
      })
      .addCase(updateStudentProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setAuth, logout, clearError } = authSlice.actions
export default authSlice.reducer