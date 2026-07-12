import { createSlice } from '@reduxjs/toolkit'

const THEME_KEY = 'hh_theme'

const loadTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // ignore
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const initialState = {
  mode: loadTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem(THEME_KEY, state.mode)
    },
    setTheme: (state, action) => {
      state.mode = action.payload
      localStorage.setItem(THEME_KEY, state.mode)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer

export const selectThemeMode = (state) => state.theme.mode