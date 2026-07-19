import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { selectSidebarCollapsed } from '@/app/slices/uiSlice'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useSocket from '@/hooks/useSocket'
import { cn } from '@/utils/cn'
import MessageNotificationBubble from '@/components/message/MessageNotificationBubble'

const RootLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const collapsed = useSelector(selectSidebarCollapsed)
  const location = useLocation()

  useSocket()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

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
        <main className="min-h-[calc(100dvh-60px)] mt-[60px]">
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
      <MessageNotificationBubble />
    </div>
  )
}

export default RootLayout