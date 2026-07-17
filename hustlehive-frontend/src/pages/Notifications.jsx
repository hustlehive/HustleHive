import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, Trash2, Loader2 } from 'lucide-react'
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from '@/features/notifications/useNotifications'
import NotificationItem from '@/components/notification/NotificationItem'
import NotificationSkeleton from '@/components/skeletons/NotificationSkeleton'
import EmptyState from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import { cn } from '@/utils/cn'

const Notifications = () => {
  const { data, isLoading } = useNotifications()
  const { mutate: markRead, isPending: isMarking } = useMarkNotificationRead()
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead()
  const { mutate: deleteOne } = useDeleteNotification()
  const { mutate: deleteAll, isPending: isDeletingAll } = useDeleteAllNotifications()

  const notifications = data?.notifications || []
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
            : 'All caught up'
        }
        actions={
          notifications.length > 0 ? (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead()}
                  disabled={isMarkingAll || isDeletingAll}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
                    'border-border text-muted-foreground hover:text-foreground hover:bg-accent',
                    'disabled:opacity-60 disabled:cursor-not-allowed'
                  )}
                >
                  {isMarkingAll ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Mark all read
                </button>
              )}
              <button
                onClick={() => deleteAll()}
                disabled={isDeletingAll || isMarkingAll}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
                  'border-destructive/30 text-destructive hover:bg-destructive/10',
                  'disabled:opacity-60 disabled:cursor-not-allowed'
                )}
              >
                {isDeletingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Clear all
              </button>
            </div>
          ) : null
        }
      />

      <div className="bg-card border border-border rounded-[15px] overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-border">
            {[...Array(6)].map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="When something happens — applications, friend requests, messages — you'll see it here."
          />
        ) : (
          <div className="divide-y divide-border p-1">
            <AnimatePresence initial={false}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkRead={(id) => markRead(id)}
                  onDelete={(id) => deleteOne(id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications