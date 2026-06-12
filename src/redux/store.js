import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import jobReducer from './slices/jobSlice'
import applicationReducer from './slices/applicationSlice'
import messageReducer from './slices/messageSlice'
import notificationReducer from './slices/notificationSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    messages: messageReducer,
    notifications: notificationReducer,
  },
})

export default store
