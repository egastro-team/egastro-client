import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { apiClient } from '@/lib/api-client'
import { userSchema, type User } from '@/lib/api-schemas'
import { useAuthStore } from '@/stores/auth-store'

import { loginResponseSchema, type LoginFormValues } from '../schemas'

type Credentials = Pick<LoginFormValues, 'email' | 'password'>

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export async function login(credentials: Credentials) {
  const { data } = await apiClient.post('/auth/login', credentials)
  return loginResponseSchema.parse(data)
}

export async function register(credentials: Credentials): Promise<User> {
  const { data } = await apiClient.post('/auth/register', credentials)
  return userSchema.parse(data)
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get('/auth/me')
  return userSchema.parse(data)
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  return useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session)
      toast.success('Ви увійшли в акаунт')
    },
  })
}

/** Registers, then logs in with the same credentials (registration itself issues no token). */
export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession)
  return useMutation({
    mutationFn: async (credentials: Credentials) => {
      await register(credentials)
      return login(credentials)
    },
    onSuccess: (session) => {
      setSession(session)
      toast.success('Акаунт створено. Ласкаво просимо до єГастро!')
    },
  })
}

/**
 * Re-validates a stored token against `/auth/me` and keeps the stored user (role) fresh.
 * A 401 is handled globally by the api client, which clears the session.
 */
export function useCurrentUserSync() {
  const token = useAuthStore((s) => s.accessToken)
  return useQuery({
    queryKey: [...authKeys.me(), token],
    queryFn: async () => {
      const user = await fetchCurrentUser()
      useAuthStore.getState().setUser(user)
      return user
    },
    enabled: Boolean(token),
    retry: false,
    staleTime: 5 * 60_000,
  })
}
