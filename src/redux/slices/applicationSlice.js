import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../services/api'

// Async Thunks
export const applyForJob = createAsyncThunk(
  'applications/apply',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await API.post('/api/applications', applicationData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit application')
    }
  }
)

export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/api/applications')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch applications')
    }
  }
)

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/api/applications/${id}`, { status, notes })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update application status')
    }
  }
)

const initialState = {
  applications: [],
  loading: false,
  error: null,
}

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearApplicationError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Apply
      .addCase(applyForJob.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false
        state.applications.unshift(action.payload)
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch all
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false
        state.applications = action.payload
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.applications.findIndex(a => a._id === action.payload._id)
        if (index !== -1) {
          // Keep populated objects if existing in list (like studentId, jobId)
          state.applications[index] = {
            ...state.applications[index],
            status: action.payload.status,
            notes: action.payload.notes
          }
        }
      })
  }
})

export const { clearApplicationError } = applicationSlice.actions
export default applicationSlice.reducer
