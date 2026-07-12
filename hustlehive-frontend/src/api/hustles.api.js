import axios from './axios'

export const getHustles = (params) => axios.get('/hustles', { params })

export const getHustleById = (id) => axios.get(`/hustles/${id}`)

export const createHustle = (formData) =>
  axios.post('/hustles', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const updateHustle = (id, data) => axios.put(`/hustles/${id}`, data)

export const deleteHustle = (id) => axios.delete(`/hustles/${id}`)

export const applyToHustle = (id) => axios.post(`/hustles/${id}/apply`)

export const getApplicants = (id) => axios.get(`/hustles/${id}/applicants`)

export const acceptApplication = (appId) =>
  axios.put(`/hustles/applications/${appId}/accept`)

export const rejectApplication = (appId) =>
  axios.put(`/hustles/applications/${appId}/reject`)

export const getMyApplications = () =>
  axios.get('/hustles/applications/my-applications')

export const uploadHustleImage = (hustleId, formData) =>
  axios.put(`/hustles/${hustleId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteHustleImage = (hustleId) =>
  axios.delete(`/hustles/${hustleId}/image`)