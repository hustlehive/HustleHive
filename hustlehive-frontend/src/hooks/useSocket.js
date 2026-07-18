import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { initSocket, emitRegister } from '@/services/socket'
import {
  incrementUnreadNotifications,
  incrementUnreadMessages,
} from '@/app/slices/uiSlice'
import { queryKeys } from '@/constants/queryKeys'
import useAuth from './useAuth'

const useSocket = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { user, token, isAuthenticated } = useAuth()
  const listenersAttached = useRef(false)

  useEffect(() => {
    if (!isAuthenticated || !token || !user) return

    const userId = (user._id || user.id)?.toString()
    const socket = initSocket(token)

    if (listenersAttached.current) {
      if (socket.connected) emitRegister(userId)
      return
    }

    const handleConnect = () => {
      emitRegister(userId)
    }

    // Updates inbox preview when any new message arrives
    // Increments unread badge only when NOT in that conversation
    const handleNewMessage = (payload) => {
      const { conversationId } = payload
      queryClient.invalidateQueries({ queryKey: queryKeys.inbox() })
      const currentPath = window.location.pathname
      if (!currentPath.includes(conversationId)) {
        dispatch(incrementUnreadMessages())
      }
    }

    // message-notification arrives on receiver's socket
    // Use it to refresh inbox list in real time
    const handleMessageNotification = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inbox() })
    }

    // When sender deletes for everyone, update inbox last message preview
    const handleDeleteForEveryone = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inbox() })
    }

    const handleNewNotification = (notification) => {
      queryClient.setQueryData(queryKeys.notifications(), (old) => {
        if (!old) return old
        const exists = old.notifications?.some((n) => n._id === notification._id)
        if (exists) return old
        return {
          ...old,
          notifications: [notification, ...(old.notifications || [])],
          count: (old.count || 0) + 1,
        }
      })
      dispatch(incrementUnreadNotifications())
    }

    socket.on('connect', handleConnect)
    socket.on('new-message', handleNewMessage)
    socket.on('message-notification', handleMessageNotification)
    socket.on('delete-for-everyone', handleDeleteForEveryone)
    socket.on('new-notification', handleNewNotification)
    listenersAttached.current = true

    if (socket.connected) handleConnect()

    return () => {
      socket.off('connect', handleConnect)
      socket.off('new-message', handleNewMessage)
      socket.off('message-notification', handleMessageNotification)
      socket.off('delete-for-everyone', handleDeleteForEveryone)
      socket.off('new-notification', handleNewNotification)
      listenersAttached.current = false
    }
  }, [isAuthenticated, token, user?._id, user?.id])
}

export default useSocket