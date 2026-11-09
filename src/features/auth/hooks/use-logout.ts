import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { useAuthStore } from '@/stores/auth-store'

/** There is no server logout endpoint: the client just discards its token (CONTRACT.md §3). */
export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession)
  const navigate = useNavigate()
  return () => {
    clearSession()
    toast.success('Ви вийшли з акаунта')
    navigate('/', { replace: true })
  }
}
