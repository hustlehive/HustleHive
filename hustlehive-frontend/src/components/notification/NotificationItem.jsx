import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { getRelativeTime } from '@/utils/getRelativeTime'
import AppAvatar from '@/components/common/AppAvatar'

const NotificationItem = ({ notification, onMarkRead, onDelete, compact = false }) => {
  const { _id, title, body, isRead, createdAt, sender } = notification

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-default',
        !isRead && 'bg-primary/5',
        'hover:bg-accent group'
      )}
    >
      <AppAvatar
        src={sender?.profilePic?.url}
        name={sender?.fullName}
        size="sm"
        className="shrink-0 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <p className={cn('text-xs leading-relaxed text-foreground', !isRead && 'font-medium')}>
          <span className="font-semibold">{sender?.fullName || 'HustleHive'}</span>{' '}
          {body}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {getRelativeTime(createdAt)}
        </p>
      </div>
      {!isRead && (
        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
      )}
    </motion.div>
  )
}

export default NotificationItem