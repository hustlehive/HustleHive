import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getSocket } from '@/services/socket'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/app/slices/authSlice'
import AppAvatar from '@/components/common/AppAvatar'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'

const DISPLAY_DURATION = 5000

const MessageNotificationBubble = () => {
  const [current, setCurrent] = useState(null)
  const queueRef = useRef([])
  const timerRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { user } = useAuth()

  const showNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      setCurrent(null)
      return
    }
    const next = queueRef.current.shift()
    setCurrent(next)

    // Auto dismiss after DISPLAY_DURATION
    timerRef.current = setTimeout(() => {
      setCurrent(null)
      // Small gap before showing next so exit animation completes
      setTimeout(showNext, 300)
    }, DISPLAY_DURATION)
  }, [])

  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setCurrent(null)
    // Small gap before showing next
    setTimeout(showNext, 300)
  }, [showNext])

  useEffect(() => {
    if (!isAuthenticated) return

    let socket = getSocket()
    let retryTimer = null

    const handleMessageNotification = (payload) => {
      const { conversationId, sender, message } = payload

      const senderId = (sender?._id || sender?.id)?.toString()
      const currentUserId = (user?._id || user?.id)?.toString()
      if (senderId === currentUserId) return

      const path = window.location.pathname
      if (path.includes('/inbox')) return
      if (path.includes(conversationId)) return

      const id = `${Date.now()}-${Math.random()}`
      const notif = { id, conversationId, sender, message }

      if (!current && queueRef.current.length === 0) {
        queueRef.current.push(notif)
        showNext()
      } else {
        queueRef.current = [notif]
      }
    }

    const attach = () => {
      socket = getSocket()
      if (!socket) {
        retryTimer = setTimeout(attach, 500)
        return
      }
      socket.on('message-notification', handleMessageNotification)
    }

    attach()

    return () => {
      if (retryTimer) clearTimeout(retryTimer)
      const s = getSocket()
      if (s) s.on('message-notification', handleMessageNotification)
    }
  }, [isAuthenticated, user, current, showNext])

  // Also suppress bubble when user navigates to inbox
  useEffect(() => {
    const path = location.pathname
    if (path.includes('/inbox')) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      setCurrent(null)
      queueRef.current = []
    }
  }, [location.pathname])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleClick = () => {
    const convId = current?.conversationId
    dismiss()
    if (convId) navigate(ROUTES.CONVERSATION(convId))
  }

  if (!current) return null

  const preview = current.message?.content
    ? current.message.content.length > 50
      ? current.message.content.slice(0, 50) + '...'
      : current.message.content
    : 'Sent you a message'

  const displayPreview = current.message?.deletedForEveryone
    ? 'This message was deleted.'
    : preview

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto"
        >
          <div
            onClick={handleClick}
            className="flex items-center gap-3 bg-card border border-border rounded-2xl shadow-xl px-4 py-3 cursor-pointer hover:border-primary/30 hover:shadow-2xl transition-all duration-200 w-[300px]"
          >
            <AppAvatar
              src={current.sender?.profilePic?.url}
              name={current.sender?.fullName}
              size="md"
              className="shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate leading-tight">
                {current.sender?.fullName || 'Someone'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                {displayPreview}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); dismiss() }}
              className="shrink-0 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default MessageNotificationBubble