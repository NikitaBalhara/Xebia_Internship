import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../services/api'

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/api/notifications')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch notifications')
    }
  }
)

export const markNotificationsAsRead = createAsyncThunk(
  'notifications/markRead',
  async (notificationIds = [], { rejectWithValue }) => {
    try {
      await API.patch('/api/notifications/read', { notificationIds })
      return notificationIds
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark notifications as read')
    }
  }
)

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter(n => !n.isRead).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Mark read
      .addCase(markNotificationsAsRead.fulfilled, (state, action) => {
        const idsToMark = action.payload
        state.notifications = state.notifications.map(n => {
          if (idsToMark.length === 0 || idsToMark.includes(n._id)) {
            return { ...n, isRead: true }
          }
          return n
        })
        state.unreadCount = state.notifications.filter(n => !n.isRead).length
      })
  }
})

export default notificationSlice.reducer
