import axios from 'axios'

import { env } from '@/lib/env'
import { getValidAccessToken, useAuthStore } from '@/stores/auth-store'

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = getValidAccessToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // An expired/invalid token on a protected call ends the session (CONTRACT.md §3).
    // Login itself also answers 401 for wrong credentials, so it is excluded.
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !error.config?.url?.includes('/auth/login') &&
      useAuthStore.getState().accessToken
    ) {
      useAuthStore.getState().clearSession()
    }
    return Promise.reject(error)
  },
)
