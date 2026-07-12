import { io } from 'socket.io-client'
import { SOCKET_URL } from '@/constants/config'

let socket = null

export const initSocket = (token) => {
  if (socket?.connected) return socket

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  })

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason)
  })

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message)
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
    console.log('[Socket] Cleaned up')
  }
}

export const emitRegister = (userId) => {
  socket?.emit('register', userId)
}

export const joinConversation = (conversationId) => {
  socket?.emit('join-conversation', conversationId)
}

export const leaveConversation = (conversationId) => {
  socket?.emit('leave-conversation', conversationId)
}