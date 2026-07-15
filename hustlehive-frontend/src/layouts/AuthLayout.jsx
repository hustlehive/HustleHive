import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from '@/components/common/ThemeToggle'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">
            HustleHive
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} HustleHive. Built for college hustlers.
      </footer>
    </div>
  )
}

export default AuthLayout