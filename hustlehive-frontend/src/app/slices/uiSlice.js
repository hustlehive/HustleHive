import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarCollapsed: false,
  unreadNotificationCount: 0,
  unreadMessageCount: 0,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload
    },
    setUnreadNotifications: (state, action) => {
      state.unreadNotificationCount = action.payload
    },
    incrementUnreadNotifications: (state) => {
      state.unreadNotificationCount += 1
    },
    clearUnreadNotifications: (state) => {
      state.unreadNotificationCount = 0
    },
    setUnreadMessages: (state, action) => {
      state.unreadMessageCount = action.payload
    },
    incrementUnreadMessages: (state) => {
      state.unreadMessageCount += 1
    },
    clearUnreadMessages: (state) => {
      state.unreadMessageCount = 0
    },
  },
})

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setUnreadNotifications,
  incrementUnreadNotifications,
  clearUnreadNotifications,
  setUnreadMessages,
  incrementUnreadMessages,
  clearUnreadMessages,
} = uiSlice.actions

export default uiSlice.reducer

export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed
export const selectUnreadNotifications = (state) => state.ui.unreadNotificationCount
export const selectUnreadMessages = (state) => state.ui.unreadMessageCount