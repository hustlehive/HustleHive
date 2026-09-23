import axios from './axios'

export const getAdminDashboard = () => axios.get('/admin/dashboard')
export const getAdminUsers = () => axios.get('/admin/users')
export const getAdminUserById = (userId) => axios.get(`/admin/users/${userId}`)
export const deleteAdminUser = (userId) => axios.delete(`/admin/users/${userId}`)
export const getAdminHustles = () => axios.get('/admin/hustles')
export const deleteAdminHustle = (hustleId) => axios.delete(`/admin/hustles/${hustleId}`)
export const getAdminApplications = () => axios.get('/admin/applications')

// Reports
export const getReportedUsers = () => axios.get('/admin/reports/users')
export const getReportedHustles = () => axios.get('/admin/reports/hustles')

// Ban / Unban
export const banUser = (userId) => axios.put(`/admin/users/${userId}/ban`)
export const unbanUser = (userId) => axios.put(`/admin/users/${userId}/unban`)

// Dismiss reports
export const dismissUserReports = (userId) => axios.delete(`/admin/dismiss/users/${userId}`)
export const dismissHustleReports = (hustleId) => axios.delete(`/admin/dismiss/hustles/${hustleId}`)

// Delete reported hustle (soft) / Restore
export const deleteReportedHustle = (hustleId) => axios.delete(`/admin/hustles/${hustleId}`)
export const restoreHustle = (hustleId) => axios.put(`/admin/hustles/${hustleId}/restore`)

// Delete single report
export const deleteReport = (reportId) => axios.delete(`/admin/reports/${reportId}`)