import axios from './axios'

export const sendOtp = (data) => axios.post('/auth/send-otp', data)

export const registerUser = (formData) =>
  axios.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const loginUser = (data) => axios.post('/auth/login', data)

export const getMe = () => axios.get('/auth/me')

export const forgotPassword = (data) => axios.post('/auth/forgot-password', data)

export const resetPassword = (data) => axios.post('/auth/reset-password', data)