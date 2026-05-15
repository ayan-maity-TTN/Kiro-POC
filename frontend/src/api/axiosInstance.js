import axios from 'axios'
import toast from 'react-hot-toast'
import { store } from '../store'
import { logout } from '../store/slices/authSlice'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api',
  withCredentials: true,          // send HttpOnly cookies automatically
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// ── Response interceptor ─────────────────────────────────────────────────────
let isRefreshing = false
let failedQueue = []

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve()
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 → try silent refresh only for authenticated requests (not login itself)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/user/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Backend auto-refreshes via JwtFilter when access token expires
        // Just retry the original request; the filter will set a new cookie
        const response = await axiosInstance(originalRequest)
        processQueue(null)
        return response
      } catch (refreshError) {
        processQueue(refreshError)
        store.dispatch(logout())
        toast.error('Session expired. Please log in again.')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Global error messages
    const message = error.response?.data?.message || error.message || 'Something went wrong'

    if (error.response?.status === 403) {
      toast.error('Access denied.')
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.')
    } else if (!error.response) {
      toast.error('Network error. Check your connection.')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
