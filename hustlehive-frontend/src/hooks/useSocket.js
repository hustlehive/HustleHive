import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { initSocket, emitRegister, disconnectSocket } from '@/services/socket'
import { incrementUnreadNotifications, incrementUnreadMessages } from '@/app/slices/uiSlice'
import { queryKeys } from '@/constants/queryKeys'
import useAuth from './useAuth'

const useSocket = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { user, token, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !token || !user) return

    const socket = initSocket(token)

    const handleConnect = () => {
      emitRegister(user._id)
    }

    const handleNewMessage = (message) => {
      const convId = message.conversationId

      // Update conversation cache
      queryClient.setQueryData(queryKeys.conversation(convId), (old) => {
        if (!old) return old
        const exists = old.messages?.some((m) => m._id === message._id)
        if (exists) return old
        return { ...old, messages: [...(old.messages || []), message] }
      })

      // Refresh inbox
      queryClient.invalidateQueries({ queryKey: ['messages', 'inbox'] })

      // Increment unread badge only if not viewing that conversation
      const currentPath = window.location.pathname
      if (!currentPath.includes(convId)) {
        dispatch(incrementUnreadMessages())
      }
    }

    const handleNewNotification = (notification) => {
      // Prepend to notification cache
      queryClient.setQueryData(queryKeys.notifications(), (old) => {
        if (!old) return old
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
    socket.on('new-notification', handleNewNotification)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('new-message', handleNewMessage)
      socket.off('new-notification', handleNewNotification)
    }
  }, [isAuthenticated, token, user, dispatch, queryClient])
}

export default useSocket