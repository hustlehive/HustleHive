import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { initSocket, emitRegister, getSocket } from '@/services/socket'
import { incrementUnreadNotifications, incrementUnreadMessages } from '@/app/slices/uiSlice'
import { queryKeys } from '@/constants/queryKeys'
import useAuth from './useAuth'

const useSocket = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { user, token, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !token || !user) {
      console.log('[useSocket] Not authenticated, skipping socket init')
      return
    }

    const userId = (user._id || user.id)?.toString()
    console.log('[useSocket] Initializing socket for user:', userId)

    const socket = initSocket(token)

    const handleConnect = () => {
      console.log('[useSocket] Socket connected, emitting register for:', userId)
      emitRegister(userId)
    }

    const handleNewMessage = (payload) => {

      console.log("[useSocket] new-message:", payload)

      const { conversationId } = payload

      queryClient.invalidateQueries({
        queryKey: queryKeys.inbox()
      })

      const currentPath = window.location.pathname

      if (!currentPath.includes(conversationId)) {
        dispatch(incrementUnreadMessages())
      }

    }

    const handleNewNotification = (notification) => {
      console.log('[useSocket] new-notification event received:', notification)

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
    socket.on('new-notification', handleNewNotification)

    if (socket.connected) {
      console.log('[useSocket] Socket already connected, registering immediately')
      handleConnect()
    }

    return () => {
      socket.off('connect', handleConnect)
      socket.off('new-message', handleNewMessage)
      socket.off('new-notification', handleNewNotification)
    }
  }, [isAuthenticated, token, user, dispatch, queryClient])
}

export default useSocket