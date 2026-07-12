import axios from './axios'

export const getAdminDashboard = () => axios.get('/admin/dashboard')

export const getAdminUsers = () => axios.get('/admin/users')

export const getAdminUserById = (userId) => axios.get(`/admin/users/${userId}`)

export const deleteAdminUser = (userId) => axios.delete(`/admin/users/${userId}`)

export const getAdminHustles = () => axios.get('/admin/hustles')

export const deleteAdminHustle = (hustleId) =>
  axios.delete(`/admin/hustles/${hustleId}`)

export const getAdminApplications = () => axios.get('/admin/applications')