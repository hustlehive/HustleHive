import { motion } from 'framer-motion'
import { Trash2, Circle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { getRelativeTime } from '@/utils/getRelativeTime'
import AppAvatar from '@/components/common/AppAvatar'

const NotificationItem = ({
  notification,
  onMarkRead,
  onDelete,
  compact = false,
}) => {
  const { _id, title, body, isRead, createdAt, sender } = notification

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg transition-colors group',
        !isRead && 'bg-primary/5',
        'hover:bg-accent'
      )}
    >
      {/* Avatar */}
      <AppAvatar
        src={sender?.profilePic?.url}
        name={sender?.fullName}
        size="sm"
        className="shrink-0 mt-0.5"
      />

      {/* Content */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => !isRead && onMarkRead?.(_id)}
      >
        <p className={cn(
          'text-xs leading-relaxed text-foreground',
          !isRead && 'font-medium'
        )}>
          <span className="font-semibold">{sender?.fullName || 'HustleHive'}</span>{' '}
          {body}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {getRelativeTime(createdAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Unread dot */}
        {!isRead && (
          <button
            onClick={() => onMarkRead?.(_id)}
            title="Mark as read"
            className="p-1 rounded-full hover:bg-primary/10 transition-colors"
          >
            <Circle className="w-2.5 h-2.5 fill-primary text-primary" />
          </button>
        )}

        {/* Delete */}
        {!compact && (
          <button
            onClick={() => onDelete?.(_id)}
            title="Delete notification"
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default NotificationItem