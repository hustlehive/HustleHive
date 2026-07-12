import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectThemeMode } from '@/app/slices/themeSlice'
import AppRouter from '@/router'

const App = () => {
  const themeMode = useSelector(selectThemeMode)

  useEffect(() => {
    const root = document.documentElement
    if (themeMode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [themeMode])

  return <AppRouter />
}

export default App