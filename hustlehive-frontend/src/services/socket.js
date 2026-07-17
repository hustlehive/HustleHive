import { io } from 'socket.io-client'
import { SOCKET_URL } from '@/constants/config'

let socket = null

export const initSocket = (token) => {
  if (socket?.connected) {
    console.log('[Socket] Already connected, reusing:', socket.id)
    return socket
  }

  console.log('[Socket] Initializing with SOCKET_URL:', SOCKET_URL)

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  })

  socket.once("connect", () => {

    console.log(
      "[Socket] Connected:",
      socket.id
    )

  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket] ❌ Disconnected. Reason:', reason)
  })

  socket.on('connect_error', (err) => {
    console.error('[Socket] ❌ Connection error:', err.message)
  })

  if (import.meta.env.DEV) {

    socket.onAny((event, ...args) => {

      console.log(
        `[Socket] ${event}`,
        args
      )

    })

  }

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
  console.log('[Socket] Emitting register for userId:', userId)
  socket?.emit('register', userId)
}

export const joinConversation = (conversationId) => {
  console.log('[Socket] Joining conversation room:', conversationId)
  socket?.emit('join-conversation', conversationId)
}

export const leaveConversation = (conversationId) => {
  console.log('[Socket] Leaving conversation room:', conversationId)
  socket?.emit('leave-conversation', conversationId)
}