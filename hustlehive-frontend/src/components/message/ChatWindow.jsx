import { useEffect, useRef, useCallback } from 'react'
import { MessageSquare, ArrowLeft, Lock } from 'lucide-react'
import {
  useConversationMessages,
  useSendMessage,
  useMarkConversationRead,
  useEditMessage,
  useDeleteMessage,
  useDeleteMessageForMe,
} from '@/features/messages/useMessages'
import { joinConversation, leaveConversation, getSocket } from '@/services/socket'
import { clearUnreadMessages } from '@/app/slices/uiSlice'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import MessageBubble from './MessageBubble'
import DateSeparator from './DateSeparator'
import ChatInput from './ChatInput'
import AppAvatar from '@/components/common/AppAvatar'
import useAuth from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const isSameDay = (a, b) => {
  if (!a || !b) return false
  const da = new Date(a)
  const db = new Date(b)
  if (isNaN(da.getTime()) || isNaN(db.getTime())) return false
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

const MessagesSkeleton = () => (
  <div className="flex-1 p-4 space-y-4 overflow-hidden">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={cn(
          'flex items-end gap-2 animate-pulse',
          i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
        )}
      >
        <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
        <div className={cn('h-10 rounded-[12px] bg-muted', i % 2 === 0 ? 'w-48' : 'w-36')} />
      </div>
    ))}
  </div>
)

// E2E encryption notice - shown once above the first message
// const EncryptionNotice = () => (
//   <div className="flex items-center justify-center gap-1.5 py-3 px-4">
//     <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
//     <p className="text-[11px] text-muted-foreground text-center">
//       Messages are end-to-end encrypted. No one outside this chat can read them.
//     </p>
//   </div>
// )

const ChatWindow = ({ conversation, onBack }) => {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const messagesEndRef = useRef(null)

  const conversationId = conversation?.conversationId

  const { data, isLoading } = useConversationMessages(conversationId)
  const { mutate: send, isPending: isSending } = useSendMessage()
  const { mutate: markRead } = useMarkConversationRead()
  const { mutate: editMsg } = useEditMessage(conversationId)
  const { mutate: deleteMsg } = useDeleteMessage(conversationId)
  const { mutate: deleteMsgForMe } = useDeleteMessageForMe(conversationId)

  const messages = data?.messages || []
  const other = conversation?.user
  const currentUserId = (user?._id || user?.id)?.toString()

  // Join socket room
  useEffect(() => {
    if (!conversationId) return

    const socket = getSocket()
    const doJoin = () => {
      joinConversation(conversationId)
      markRead(conversationId)
      dispatch(clearUnreadMessages())
    }

    if (socket) {
      if (socket.connected) {
        doJoin()
      } else {
        socket.once('connect', doJoin)
      }
    }

    return () => {
      socket?.off('connect', doJoin)
      const s = getSocket()
      if (s?.connected) leaveConversation(conversationId)
    }
  }, [conversationId])

  // All real-time socket listeners for this conversation
  useEffect(() => {
    if (!conversationId) return
    const socket = getSocket()
    if (!socket) return

    // New message - append to cache
    const handleNewMessage = (payload) => {
      const { conversationId: incomingId, message } = payload
      if (incomingId !== conversationId) return
      queryClient.setQueryData(queryKeys.conversation(conversationId), (old) => {
        console.log("CACHE:", old);
        console.log("PAYLOAD:", payload);
        if (!old) return old
        const exists = old.messages.some((m) => m._id === message._id)
        if (exists) return old
        return { ...old, messages: [...old.messages, message] }
      })
      markRead(conversationId)
    }

    // Edited message - update content in cache for both sender and receiver
    const handleEditedMessage = (payload) => {
      const { conversationId: incomingId, message } = payload
      if (incomingId !== conversationId) return
      queryClient.setQueryData(queryKeys.conversation(conversationId), (old) => {
        if (!old) return old
        return {
          ...old,
          messages: old.messages.map((m) =>
            m._id === message._id ? { ...m, ...message } : m
          ),
        }
      })
    }

    const handleDeleteForEveryone = (payload) => {
      const { conversationId: incomingId, messageId } = payload
      if (incomingId !== conversationId) return
      queryClient.setQueryData(queryKeys.conversation(conversationId), (old) => {
        if (!old) return old
        return {
          ...old,
          messages: old.messages.map((m) =>
            m._id === messageId
              ? { ...m, deletedForEveryone: true, content: 'This message was deleted.' }
              : m
          ),
        }
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.inbox() })
    }

    socket.on('new-message', handleNewMessage)
    socket.on('edited-message', handleEditedMessage)
    socket.on('delete-for-everyone', handleDeleteForEveryone)

    return () => {
      socket.off('new-message', handleNewMessage)
      socket.off('edited-message', handleEditedMessage)
      socket.off('delete-for-everyone', handleDeleteForEveryone)
    }
  }, [conversationId, queryClient])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Mark read on focus
  useEffect(() => {
    const handleFocus = () => {
      if (conversationId) markRead(conversationId)
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [conversationId])

  const handleSend = useCallback((content) => {
    if (!conversationId) return
    send({ conversationId, content, type: 'text' })
  }, [conversationId, send])

  const handleEdit = useCallback((messageId, content) => {
    editMsg({ messageId, content })
  }, [editMsg])

  const handleDelete = useCallback((messageId) => {
    deleteMsg(messageId)
  }, [deleteMsg])

  const handleDeleteForMe = useCallback((messageId) => {
    deleteMsgForMe(messageId)
  }, [deleteMsgForMe])

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground mb-1">Your messages</h3>
          <p className="text-sm text-muted-foreground">Select a conversation to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <AppAvatar src={other?.profilePic?.url} name={other?.fullName} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {other?.fullName || 'Unknown'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            @{other?.username}{other?.college ? ` · ${other.college}` : ''}
          </p>
          {conversation.type === 'hustle' && (
            <p className="text-[10px] text-primary truncate">Hustle conversation</p>
          )}
        </div>
      </div>

      {/* Messages */}
      {isLoading ? (
        <MessagesSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-1">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
              <AppAvatar src={other?.profilePic?.url} name={other?.fullName} size="xl" />
              <div>
                <p className="text-sm font-semibold text-foreground">{other?.fullName}</p>
                <p className="text-xs text-muted-foreground mt-1">No messages yet. Say hello!</p>
              </div>
              {/* <EncryptionNotice /> */}
            </div>
          ) : (
            <>
              {/* E2E notice above first message */}
              {/* <EncryptionNotice /> */}

              {messages.map((msg, idx) => {
                const prevMsg = messages[idx - 1]
                const showDateSep = !prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt)
                const senderId = (
                  msg.sender?._id ||
                  msg.sender?.id ||
                  msg.sender
                )?.toString()
                const isMine = senderId === currentUserId

                return (
                  <div key={msg._id}>
                    {showDateSep && msg.createdAt && (
                      <DateSeparator date={msg.createdAt} />
                    )}
                    <MessageBubble
                      message={msg}
                      isMine={isMine}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onDeleteForMe={handleDeleteForMe}
                    />
                  </div>
                )
              })}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <ChatInput onSend={handleSend} isPending={isSending} disabled={false} />
    </div>
  )
}

export default ChatWindow