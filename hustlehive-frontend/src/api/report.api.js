import axios from './axios'

export const reportUser = (userId, data) =>
  axios.post(`/report/user/${userId}`, data)

export const reportHustle = (hustleId, data) =>
  axios.post(`/report/hustle/${hustleId}`, data)