import axios from 'axios'
import { API_BASE_URL } from '@/constants/config'
import store from '@/app/store'
import { logout } from '@/app/slices/authSlice'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'

    if (status === 401) {
      store.dispatch(logout())
      // Navigation happens inside the router guard, not here
    }

    const normalizedError = new Error(message)
    normalizedError.status = status
    normalizedError.data = error.response?.data

    return Promise.reject(normalizedError)
  }
)

export default axiosInstance