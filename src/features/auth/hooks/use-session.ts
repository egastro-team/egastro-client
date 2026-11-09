import { useAuthStore } from '@/stores/auth-store'

export function useSession() {
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  const isAuthenticated = Boolean(accessToken && user)
  return {
    user,
    isAuthenticated,
    isAdmin: isAuthenticated && user?.role === 'ADMIN',
  }
}
