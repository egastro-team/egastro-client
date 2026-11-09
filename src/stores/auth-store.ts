import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { User } from '@/lib/api-schemas'

type AuthState = {
  accessToken: string | null
  /** Epoch milliseconds when the token stops being valid. */
  expiresAt: number | null
  user: User | null
  setSession: (session: { accessToken: string; expiresIn: number; user: User }) => void
  setUser: (user: User) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      expiresAt: null,
      user: null,
      setSession: ({ accessToken, expiresIn, user }) =>
        set({ accessToken, user, expiresAt: Date.now() + expiresIn * 1000 }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ accessToken: null, expiresAt: null, user: null }),
    }),
    {
      name: 'egastro-auth',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.expiresAt && state.expiresAt <= Date.now()) state.clearSession()
      },
    },
  ),
)

/** Token that is present and not expired, read outside React (e.g. in the axios interceptor). */
export function getValidAccessToken(): string | null {
  const { accessToken, expiresAt, clearSession } = useAuthStore.getState()
  if (!accessToken) return null
  if (expiresAt !== null && expiresAt <= Date.now()) {
    clearSession()
    return null
  }
  return accessToken
}
