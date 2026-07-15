import { useDispatch, useSelector } from 'react-redux'
import { Moon, Sun } from 'lucide-react'
import { toggleTheme, selectThemeMode } from '@/app/slices/themeSlice'
import { cn } from '@/utils/cn'

const ThemeToggle = ({ className }) => {
  const dispatch = useDispatch()
  const mode = useSelector(selectThemeMode)

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      className={cn(
        'p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200',
        className
      )}
    >
      {mode === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  )
}

export default ThemeToggle