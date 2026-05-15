import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  role: null,       // 'CUSTOMER' | 'SELLER' | 'ADMIN'
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, role } = action.payload
      state.user = user
      state.role = role
      state.isAuthenticated = true
      state.error = null
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.role = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
  },
})

export const { setCredentials, setLoading, setError, logout, updateUser } = authSlice.actions

export const selectAuth          = (state) => state.auth
export const selectUser          = (state) => state.auth.user
export const selectRole          = (state) => state.auth.role
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

export default authSlice.reducer
