import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, Search, Bell, LogOut, User, ChevronDown, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { ROUTES } from '@/constants/routes'
import { selectSidebarCollapsed, selectUnreadNotifications } from '@/app/slices/uiSlice'
import { logout } from '@/app/slices/authSlice'
import { disconnectSocket } from '@/services/socket'
import useAuth from '@/hooks/useAuth'
import ThemeToggle from '@/components/common/ThemeToggle'
import AppAvatar from '@/components/common/AppAvatar'
import NotificationDropdown from '@/components/notification/NotificationDropdown'
import ConfirmDialog from '@/components/common/ConfirmDialog'

const Topbar = ({ onMobileMenuOpen }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const collapsed = useSelector(selectSidebarCollapsed)
  const unreadNotifications = useSelector(selectUnreadNotifications)
  const { user } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogoutConfirm = () => {
    disconnectSocket()
    dispatch(logout())
    setLogoutDialogOpen(false)
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 h-[60px] bg-card/80 backdrop-blur-sm border-b border-border z-30',
          'flex items-center gap-3 px-4 transition-all duration-[250ms]',
          'left-0 lg:left-[260px]',
          collapsed && 'lg:left-[68px]'
        )}
      >
        {/* Mobile menu button */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo — visible on mobile only (sidebar hidden) */}
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="lg:flex items-center gap-2 shrink-0"
          aria-label="Go to dashboard"
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
        </button>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hustles, users..."
              className={cn(
                'w-full pl-9 pr-4 py-2 text-sm rounded-md border border-input bg-background',
                'text-foreground placeholder:text-muted-foreground',
                'outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'
              )}
            />
          </div>
        </form>

        <div className="flex items-center gap-1 ml-auto">
          <ThemeToggle />

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen((p) => !p)
                setProfileOpen(false)
              }}
              aria-label="Notifications"
              className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
            <NotificationDropdown
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
            />
          </div>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen((p) => !p)
                setNotifOpen(false)
              }}
              className="flex items-center gap-2 p-1.5 rounded-md hover:bg-accent transition-colors"
              aria-label="Profile menu"
            >
              <AppAvatar src={user?.profilePic?.url} name={user?.fullName} size="sm" />
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-[15px] shadow-xl z-50 overflow-hidden"
                >
                  {/* User info */}
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      @{user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.college}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1">
                    <button
                      onClick={() => {
                        navigate(ROUTES.PROFILE)
                        setProfileOpen(false)
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false)
                        setLogoutDialogOpen(true)
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Log out of HustleHive?"
        description="You will be redirected to the login page. Your data will remain safe."
        confirmText="Log Out"
        cancelText="Stay"
        variant="destructive"
      />
    </>
  )
}

export default Topbar