import { useState } from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, Edit2, Trash2, Check, X, EyeOff } from 'lucide-react'
import { cn } from '@/utils/cn'
import ConfirmDialog from '@/components/common/ConfirmDialog'

const isWithinMinutes = (dateString, minutes) => {
  if (!dateString) return false
  const sent = new Date(dateString).getTime()
  if (isNaN(sent)) return false
  return (Date.now() - sent) < minutes * 60 * 1000
}

const formatMessageTime = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const MessageBubble = ({ message, isMine, onEdit, onDelete, onDeleteForMe }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [deleteEveryoneOpen, setDeleteEveryoneOpen] = useState(false)
  const [deleteMeOpen, setDeleteMeOpen] = useState(false)

  const isDeleted = message.deletedForEveryone

  // Edit: own messages, within 5 mins, not deleted
  const canEdit = isMine && !isDeleted && isWithinMinutes(message.createdAt, 5)
  // Delete for everyone: own messages, within 20 mins, not deleted
  const canDeleteEveryone = isMine && !isDeleted && isWithinMinutes(message.createdAt, 20)
  // Delete for me: always available if not already deleted
  const canDeleteForMe = !isDeleted

  const showMenu = !isDeleted && (canEdit || canDeleteEveryone || canDeleteForMe)

  const handleEditSubmit = (e) => {
    e.preventDefault()
    const trimmed = editContent.trim()
    if (!trimmed || trimmed === message.content) {
      setIsEditing(false)
      setEditContent(message.content)
      return
    }
    onEdit(message._id, trimmed)
    setIsEditing(false)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditContent(message.content)
  }

  const timeLabel = formatMessageTime(message.createdAt)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6, x: isMine ? 10 : -10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'flex items-end gap-2 group px-4 py-0.5',
          isMine ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div className={cn('max-w-[70%] flex flex-col gap-1', isMine && 'items-end')}>
          <div className="relative flex items-end gap-2">
            {/* Action menu */}
            {showMenu && !isEditing && (
              <div className={cn(
                'opacity-0 group-hover:opacity-100 transition-opacity flex items-center',
                isMine ? 'order-first' : 'order-last'
              )}>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((p) => !p)}
                    className="p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>

                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setMenuOpen(false)}
                      />
                      <div className={cn(
                        'absolute bottom-full mb-1 w-40 bg-card border border-border rounded-[10px] shadow-lg z-20 overflow-hidden py-0.5',
                        isMine ? 'right-0' : 'left-0'
                      )}>
                        {/* Edit - own messages within 5 mins */}
                        {canEdit && (
                          <button
                            onClick={() => {
                              setIsEditing(true)
                              setEditContent(message.content)
                              setMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                        )}

                        {/* Delete for me - always available */}
                        {canDeleteForMe && (
                          <button
                            onClick={() => {
                              setDeleteMeOpen(true)
                              setMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-accent transition-colors"
                          >
                            <EyeOff className="w-3 h-3" />
                            Delete for Me
                          </button>
                        )}

                        {/* Delete for everyone - own messages within 20 mins */}
                        {canDeleteEveryone && (
                          <button
                            onClick={() => {
                              setDeleteEveryoneOpen(true)
                              setMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete for Everyone
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Bubble */}
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="flex gap-2 items-end">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  autoFocus
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') handleEditCancel()
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleEditSubmit(e)
                    }
                  }}
                  className="px-3 py-2 text-sm rounded-[12px] border border-primary bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 min-w-[200px] resize-none leading-relaxed"
                  style={{ maxWidth: '300px' }}
                />
                <div className="flex gap-1 shrink-0">
                  <button
                    type="submit"
                    className="p-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="p-1.5 bg-muted text-muted-foreground rounded-md hover:bg-accent transition-colors"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className={cn(
                'px-3 py-2 rounded-[12px] text-sm leading-relaxed break-words',
                isDeleted
                  ? 'bg-muted text-muted-foreground italic border border-border'
                  : isMine
                  ? 'bg-primary text-white'
                  : 'bg-muted text-foreground'
              )}>
                {message.content}
              </div>
            )}
          </div>

          {/* Timestamp */}
          {!isDeleted && !isEditing && timeLabel && (
            <div className={cn(
              'flex items-center gap-1.5 px-1',
              isMine ? 'flex-row-reverse' : 'flex-row'
            )}>
              {message.isEdited && (
                <span className="text-[10px] text-muted-foreground italic">edited</span>
              )}
              <span className="text-[10px] text-muted-foreground">{timeLabel}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete for everyone confirmation */}
      <ConfirmDialog
        open={deleteEveryoneOpen}
        onClose={() => setDeleteEveryoneOpen(false)}
        onConfirm={() => {
          onDelete(message._id)
          setDeleteEveryoneOpen(false)
        }}
        title="Delete for everyone?"
        description="This message will be permanently deleted for everyone in the conversation. This cannot be undone."
        confirmText="Delete for Everyone"
        variant="destructive"
      />

      {/* Delete for me confirmation */}
      <ConfirmDialog
        open={deleteMeOpen}
        onClose={() => setDeleteMeOpen(false)}
        onConfirm={() => {
          onDeleteForMe(message._id)
          setDeleteMeOpen(false)
        }}
        title="Delete for you?"
        description="This message will be removed from your view only. The other person can still see it."
        confirmText="Delete for Me"
        variant="destructive"
      />
    </>
  )
}

export default MessageBubble