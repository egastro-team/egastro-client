import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'

import { useAuthStore } from '@/stores/auth-store'

afterEach(() => {
  cleanup()
  useAuthStore.getState().clearSession()
  localStorage.clear()
  vi.restoreAllMocks()
})
