import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, Trash2, ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/constants/queryKeys'
import {
  getNotifications,
  markAllNotificationsRead,
  deleteAllNotifications,
} from '@/api/notifications.api'
import NotificationItem from './NotificationItem'
import NotificationSkeleton from '@/components/skeletons/NotificationSkeleton'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const NotificationDropdown = ({ open, onClose }) => {
  const ref = useRef(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: getNotifications,
    enabled: open,
    staleTime: 0,
  })

  const notifications = data?.notifications || []
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const { mutate: markAllRead, isPending: isMarkingRead } = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() })
      toast.success('All notifications marked as read')
    },
    onError: (err) => toast.error(err.message),
  })

  const { mutate: deleteAll, isPending: isDeletingAll } = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() })
      toast.success('All notifications cleared')
    },
    onError: (err) => toast.error(err.message),
  })

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  const handleViewAll = () => {
    navigate(ROUTES.NOTIFICATIONS)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18 }}
          className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-[15px] shadow-xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-xs bg-primary text-white rounded-full px-1.5 py-0.5 font-medium">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Mark all read */}
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead()}
                  disabled={isMarkingRead || isDeletingAll}
                  title="Mark all read"
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    isMarkingRead
                      ? 'text-primary cursor-not-allowed'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  {isMarkingRead ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                </button>
              )}

              {/* Delete all */}
              {notifications.length > 0 && (
                <button
                  onClick={() => deleteAll()}
                  disabled={isDeletingAll || isMarkingRead}
                  title="Clear all"
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    isDeletingAll
                      ? 'text-destructive cursor-not-allowed'
                      : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                  )}
                >
                  {isDeletingAll ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[340px] overflow-y-auto">
            {isLoading ? (
              <div className="divide-y divide-border">
                {[...Array(3)].map((_, i) => (
                  <NotificationSkeleton key={i} />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border p-1">
                {notifications.slice(0, 6).map((n) => (
                  <NotificationItem key={n._id} notification={n} compact />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-border p-2">
              <button
                onClick={handleViewAll}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
              >
                View all notifications
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotificationDropdown