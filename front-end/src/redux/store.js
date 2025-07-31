import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    UserLogin: userReducer,
  },
})

export default store