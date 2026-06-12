import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../services/api'

// Async Thunks
export const fetchInboxContacts = createAsyncThunk(
  'messages/fetchInbox',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/api/messages/inbox/list')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch inbox')
    }
  }
)

export const fetchMessages = createAsyncThunk(
  'messages/fetchThread',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/messages/${userId}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch messages')
    }
  }
)

export const sendMessage = createAsyncThunk(
  'messages/send',
  async ({ receiverId, content }, { rejectWithValue }) => {
    try {
      const response = await API.post('/api/messages', { receiverId, content })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send message')
    }
  }
)

const initialState = {
  inboxContacts: [],
  activeThread: [],
  loading: false,
  error: null,
}

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearActiveThread: (state) => {
      state.activeThread = []
    },
    // Append real-time message dynamically if needed
    addIncomingMessage: (state, action) => {
      state.activeThread.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch inbox
      .addCase(fetchInboxContacts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchInboxContacts.fulfilled, (state, action) => {
        state.loading = false
        state.inboxContacts = action.payload
      })
      .addCase(fetchInboxContacts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch thread
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.activeThread = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.activeThread.push(action.payload)
        // Move contact to top of inbox list and update preview content
        const receiverId = action.payload.receiverId
        const contactIndex = state.inboxContacts.findIndex(c => c._id === receiverId)
        if (contactIndex !== -1) {
          const contact = state.inboxContacts[contactIndex]
          contact.latestMessage = action.payload.content
          contact.latestMessageTime = action.payload.createdAt
          state.inboxContacts.splice(contactIndex, 1)
          state.inboxContacts.unshift(contact)
        }
      })
  }
})

export const { clearActiveThread, addIncomingMessage } = messageSlice.actions
export default messageSlice.reducer
