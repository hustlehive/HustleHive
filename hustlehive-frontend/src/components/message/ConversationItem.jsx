import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import useLongPress from '@/hooks/useLongPress'
import { cn } from '@/utils/cn'
import AppAvatar from '@/components/common/AppAvatar'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { getMessageTime } from '@/utils/getRelativeTime'
import { useDeleteConversationForMe } from '@/features/messages/useMessages'
import useAuth from '@/hooks/useAuth'

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

  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutate: deleteConv, isPending: isDeleting } = useDeleteConversationForMe()
  const { revealed, handlers: longPressHandlers } = useLongPress()

  const { userId } = useAuth()

  const name = user?.fullName || 'Unknown'
  const pic = user?.profilePic?.url || null

  const isHiddenForMe = lastMessage?.hiddenFor ? lastMessage?.hiddenFor?.some((id) => id?.toString() === userId) : false

  console.log(`$hidden for: ${lastMessage.hiddenFor} and ishiddenforme: ${isHiddenForMe} and current user id: ${userId}`)

  const preview = !lastMessage
    ? 'No messages yet'
    : lastMessage.deletedForEveryone
      ? 'This message was deleted.'
      : isHiddenForMe
        ? 'Deleted for you'
        : lastMessage.content || ''

  const handleDelete = (e) => {
    e.stopPropagation()
    setDeleteOpen(true)
  }

  const handleDeleteConfirm = () => {
    deleteConv(conversationId, {
      onSuccess: () => setDeleteOpen(false),
    })
  }

  return (
    <>
      <div
        onClick={onClick}
        {...longPressHandlers}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors cursor-pointer group select-none',
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
            <div className="flex items-center gap-1 shrink-0">
              {lastMessageAt && (
                <span className="text-[11px] text-muted-foreground">
                  {getMessageTime(lastMessageAt)}
                </span>
              )}
              {/* Delete button - visible on hover */}
              <button
                onClick={handleDelete}
                title="Delete conversation for me"
                className={cn(
                  'p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors',
                  revealed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                )}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className={cn(
              'text-xs truncate',
              unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground',
              isHiddenForMe && 'italic'
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
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
        title="Delete conversation?"
        description="This conversation will be deleted for you only. The other person can still see it."
        confirmText="Delete for Me"
        variant="destructive"
      />
    </>
  )
}

export default ConversationItem
