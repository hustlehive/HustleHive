import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Search, Briefcase, FileText,
  Users, MessageSquare, Bell, User, ShieldCheck,
  LogOut, Zap, X,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { logout } from '@/app/slices/authSlice'
import { selectUnreadNotifications, selectUnreadMessages } from '@/app/slices/uiSlice'
import { disconnectSocket } from '@/services/socket'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import AppAvatar from '@/components/common/AppAvatar'
import { cn } from '@/utils/cn'

const navItems = [
  { to: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
  { to: ROUTES.SEARCH, icon: Search, label: 'Search' },
  { to: ROUTES.MY_HUSTLES, icon: Briefcase, label: 'My Hustles' },
  { to: ROUTES.MY_APPLICATIONS, icon: FileText, label: 'Applications' },
  { to: ROUTES.FRIENDS, icon: Users, label: 'Friends' },
  { to: ROUTES.INBOX, icon: MessageSquare, label: 'Messages', badge: 'messages' },
  { to: ROUTES.NOTIFICATIONS, icon: Bell, label: 'Notifications', badge: 'notifications' },
  { to: ROUTES.PROFILE, icon: User, label: 'Profile' },
]

const MobileSidebar = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const unreadNotifications = useSelector(selectUnreadNotifications)
  const unreadMessages = useSelector(selectUnreadMessages)

  const getBadge = (badge) => {
    if (badge === 'messages') return unreadMessages
    if (badge === 'notifications') return unreadNotifications
    return 0
  }

  const handleLogout = () => {
    disconnectSocket()
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate(ROUTES.LOGIN, { replace: true })
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border h-[60px]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-foreground">HustleHive</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
              {navItems.map((item) => {
                const badge = getBadge(item.badge)
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        'hover:bg-accent hover:text-foreground',
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                      )
                    }
                  >
                    <div className="relative">
                      <item.icon className="w-5 h-5" />
                      {badge > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                          {badge > 9 ? '9+' : badge}
                        </span>
                      )}
                    </div>
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}

              {isAdmin && (
                <>
                  <div className="my-2 border-t border-border" />
                  <NavLink
                    to={ROUTES.ADMIN_DASHBOARD}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        'hover:bg-accent hover:text-foreground',
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                      )
                    }
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>Admin</span>
                  </NavLink>
                </>
              )}
            </nav>

            {/* Footer */}
            <div className="border-t border-border p-2 space-y-0.5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
                <AppAvatar
                  src={user?.profilePic?.url}
                  name={user?.fullName}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{user?.fullName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user?.college}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar