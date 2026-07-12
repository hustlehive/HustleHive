import axios from './axios'

export const startConversation = (data) => axios.post('/messages/start', data)

export const sendMessage = (data) => axios.post('/messages/send', data)

export const getInbox = (type) =>
  axios.get('/messages/inbox', { params: type ? { type } : {} })

export const getConversationMessages = (conversationId) =>
  axios.get(`/messages/${conversationId}`)

export const markConversationRead = (conversationId) =>
  axios.put(`/messages/read/${conversationId}`)

export const editMessage = (messageId, content) =>
  axios.put(`/messages/edit/${messageId}`, { content })

export const deleteMessage = (messageId) =>
  axios.delete(`/messages/delete/${messageId}`)