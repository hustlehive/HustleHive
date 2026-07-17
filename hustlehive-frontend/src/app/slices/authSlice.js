import { createSlice } from '@reduxjs/toolkit'

const TOKEN_KEY = 'hh_token'
const USER_KEY = 'hh_user'

// Normalize user object — backend returns "id", we standardize to "_id"
const normalizeUser = (user) => {
  if (!user) return null
  return {
    ...user,
    _id: user._id || user.id,
  }
}

const loadFromStorage = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const raw = JSON.parse(localStorage.getItem(USER_KEY))
    const user = normalizeUser(raw)
    if (token && user) return { user, token, isAuthenticated: true }
  } catch {
    // ignore parse errors
  }
  return { user: null, token: null, isAuthenticated: false }
}

const initialState = loadFromStorage()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user: rawUser, token } = action.payload
      const user = normalizeUser(rawUser)
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = normalizeUser({ ...state.user, ...action.payload })
        localStorage.setItem(USER_KEY, JSON.stringify(state.user))
      }
    },
  },
})

export const { setCredentials, logout, updateUser } = authSlice.actions
export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated