import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../services/api'

// Async Thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Build query string
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.location) params.append('location', filters.location)
      if (filters.type) params.append('type', filters.type)
      if (filters.skills) params.append('skills', filters.skills)
      if (filters.sort) params.append('sort', filters.sort)

      const response = await API.get(`/api/jobs?${params.toString()}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch jobs')
    }
  }
)

export const fetchJobById = createAsyncThunk(
  'jobs/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/jobs/${id}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch job details')
    }
  }
)

export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await API.post('/api/jobs', jobData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to post job')
    }
  }
)

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/api/jobs/${id}`, jobData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update job')
    }
  }
)

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/api/jobs/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete job')
    }
  }
)

export const moderateJob = createAsyncThunk(
  'jobs/moderate',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/api/jobs/${id}/moderate`, { status })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to moderate job')
    }
  }
)

const initialState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
}

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = action.payload
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false
        state.currentJob = action.payload
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create
      .addCase(createJob.pending, (state) => {
        state.loading = true
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false
        state.jobs.unshift(action.payload)
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false
        const index = state.jobs.findIndex(j => j._id === action.payload._id)
        if (index !== -1) {
          state.jobs[index] = action.payload
        }
        if (state.currentJob && state.currentJob._id === action.payload._id) {
          state.currentJob = action.payload
        }
      })

      // Delete
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = state.jobs.filter(j => j._id !== action.payload)
        if (state.currentJob && state.currentJob._id === action.payload) {
          state.currentJob = null
        }
      })

      // Moderate
      .addCase(moderateJob.fulfilled, (state, action) => {
        state.loading = false
        const index = state.jobs.findIndex(j => j._id === action.payload._id)
        if (index !== -1) {
          state.jobs[index] = action.payload
        }
      })
  }
})

export const { clearCurrentJob } = jobSlice.actions
export default jobSlice.reducer
