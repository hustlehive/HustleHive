import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { selectIsAuthenticated } from '@/app/slices/authSlice'
import { selectSidebarCollapsed } from '@/app/slices/uiSlice'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useSocket from '@/hooks/useSocket'
import { cn } from '@/utils/cn'

const RootLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const collapsed = useSelector(selectSidebarCollapsed)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useSocket()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // When user logs out (isAuthenticated becomes false),
  // clear ALL cached query data so next user gets fresh data
  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.clear()
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          'transition-all duration-[250ms]',
          'lg:ml-[260px]',
          collapsed && 'lg:ml-[68px]'
        )}
      >
        <Topbar onMobileMenuOpen={() => setMobileOpen(true)} />

        <main className="min-h-[calc(100vh-60px)] mt-[60px]">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="p-4 md:p-6 h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default RootLayout