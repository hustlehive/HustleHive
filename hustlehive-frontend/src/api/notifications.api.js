import axios from './axios'

export const getNotifications = () => axios.get('/notifications')

export const markNotificationRead = (notificationId) =>
  axios.put(`/notifications/${notificationId}`)

export const markAllNotificationsRead = () => axios.put('/notifications/read-all')

export const deleteNotification = (notificationId) =>
  axios.delete(`/notifications/${notificationId}`)

export const deleteAllNotifications = () =>
  axios.delete('/notifications/delete-all')