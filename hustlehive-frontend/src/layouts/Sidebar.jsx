import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Search,
  Briefcase,
  FileText,
  Users,
  MessageSquare,
  Bell,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/cn'
import { ROUTES } from '@/constants/routes'
import {
  toggleSidebar,
  selectSidebarCollapsed,
  selectUnreadNotifications,
  selectUnreadMessages,
} from '@/app/slices/uiSlice'
import { logout } from '@/app/slices/authSlice'
import { disconnectSocket } from '@/services/socket'
import useAuth from '@/hooks/useAuth'
import AppAvatar from '@/components/common/AppAvatar'
import ConfirmDialog from '@/components/common/ConfirmDialog'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.DASHBOARD },
  { label: 'Search', icon: Search, to: ROUTES.SEARCH },
  { label: 'My Hustles', icon: Briefcase, to: ROUTES.MY_HUSTLES },
  { label: 'Applications', icon: FileText, to: ROUTES.MY_APPLICATIONS },
  { label: 'Friends', icon: Users, to: ROUTES.FRIENDS },
  { label: 'Messages', icon: MessageSquare, to: ROUTES.INBOX, badge: 'messages' },
  { label: 'Notifications', icon: Bell, to: ROUTES.NOTIFICATIONS, badge: 'notifications' },
  { label: 'Profile', icon: User, to: ROUTES.PROFILE },
]

const adminItems = [
  { label: 'Admin Panel', icon: ShieldCheck, to: ROUTES.ADMIN_DASHBOARD },
]

const NavItem = ({ item, collapsed, unreadMessages, unreadNotifications }) => {
  const badge =
    item.badge === 'messages'
      ? unreadMessages
      : item.badge === 'notifications'
      ? unreadNotifications
      : 0

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group',
          collapsed ? 'justify-center' : '',
          isActive
            ? 'bg-primary text-white'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        )
      }
    >
      <div className="relative shrink-0">
        <item.icon className="w-5 h-5" />
        {badge > 0 && collapsed && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap flex-1"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {!collapsed && badge > 0 && (
        <span className="ml-auto bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge > 99 ? '99+' : badge}
        </span>
      )}

      {collapsed && (
        <div className="absolute left-full ml-3 px-2 py-1 bg-popover border border-border text-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {item.label}
        </div>
      )}
    </NavLink>
  )
}

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const collapsed = useSelector(selectSidebarCollapsed)
  const unreadNotifications = useSelector(selectUnreadNotifications)
  const unreadMessages = useSelector(selectUnreadMessages)
  const { user, isAdmin, isAuthenticated } = useAuth()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const handleLogoutConfirm = () => {
    disconnectSocket()
    dispatch(logout())
    setLogoutDialogOpen(false)
    navigate(ROUTES.LOGIN, { replace: true })
  }

  // Redirect to dashboard if logged in, else homepage
  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD)
    } else {
      navigate(ROUTES.LANDING)
    }
  }

  const sidebarContent = (
    <>
      <div className="flex flex-col h-full">
        {/* Logo — clickable */}
        <button
          onClick={handleLogoClick}
          className={cn(
            'flex items-center h-[60px] px-3 border-b border-border shrink-0 w-full',
            'hover:bg-accent transition-colors',
            collapsed ? 'justify-center' : 'gap-2.5 px-4'
          )}
          aria-label={isAuthenticated ? 'Go to dashboard' : 'Go to homepage'}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-base text-foreground overflow-hidden whitespace-nowrap"
              >
                HustleHive
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              item={item}
              collapsed={collapsed}
              unreadMessages={unreadMessages}
              unreadNotifications={unreadNotifications}
            />
          ))}

          {isAdmin && (
            <>
              <div className={cn('pt-3 pb-1', collapsed ? 'px-0' : 'px-2')}>
                {!collapsed ? (
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Admin
                  </p>
                ) : (
                  <div className="h-px bg-border" />
                )}
              </div>
              {adminItems.map((item) => (
                <NavItem
                  key={item.to}
                  item={item}
                  collapsed={collapsed}
                  unreadMessages={0}
                  unreadNotifications={0}
                />
              ))}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="shrink-0 border-t border-border p-2">
          <div
            className={cn(
              'flex items-center gap-2.5 p-2 rounded-lg transition-colors',
              collapsed && 'justify-center'
            )}
          >
            <AppAvatar
              src={user?.profilePic?.url}
              name={user?.fullName}
              size="sm"
              className="shrink-0"
            />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="text-sm font-medium text-foreground truncate leading-tight">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate leading-tight">
                    {user?.college}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setLogoutDialogOpen(true)}
                  title="Logout"
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            'absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-card border border-border',
            'flex items-center justify-center shadow-sm hover:bg-accent transition-colors z-10',
            'hidden lg:flex'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

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

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 260 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:block fixed left-0 top-0 h-screen bg-card border-r border-border z-40 overflow-visible"
      >
        <div className="relative h-full">
          {sidebarContent}
        </div>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="fixed left-0 top-0 h-screen w-[260px] bg-card border-r border-border z-50 lg:hidden overflow-hidden"
            >
              <div className="relative h-full">
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar