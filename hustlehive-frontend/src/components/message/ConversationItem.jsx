import { cn } from '@/utils/cn'
import AppAvatar from '@/components/common/AppAvatar'
import { getMessageTime } from '@/utils/getRelativeTime'

const ConversationItem = ({ conversation, isActive, onClick }) => {
  const {
    conversationId,
    type,
    hustle,
    user,
    lastMessage,
    lastMessageAt,
    unreadCount,
  } = conversation

  const name = user?.fullName || 'Unknown'
  const pic = user?.profilePic?.url || null

  const preview = !lastMessage
    ? 'No messages yet'
    : lastMessage.deletedForEveryone
    ? 'This message was deleted.'
    : lastMessage.content || ''

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors',
        isActive
          ? 'bg-primary/10 border border-primary/20'
          : 'hover:bg-accent border border-transparent'
      )}
    >
      <div className="relative shrink-0">
        <AppAvatar src={pic} name={name} size="md" />
        {type === 'hustle' && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">H</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            'text-sm truncate',
            unreadCount > 0 ? 'font-semibold text-foreground' : 'font-medium text-foreground'
          )}>
            {name}
          </p>
          {lastMessageAt && (
            <span className="text-[11px] text-muted-foreground shrink-0">
              {getMessageTime(lastMessageAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            'text-xs truncate',
            unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
          )}>
            {preview}
          </p>
          {unreadCount > 0 && (
            <span className="shrink-0 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>

        {type === 'hustle' && (
          <p className="text-[10px] text-primary truncate mt-0.5">
            Hustle conversation
          </p>
        )}
      </div>
    </button>
  )
}

export default ConversationItem