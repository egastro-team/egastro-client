import { useState } from 'react'
import { Link, Navigate, Outlet } from 'react-router'
import { toast } from 'sonner'

import { AuthCard } from '@/components/layout/auth-card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

import { useRedirectTarget } from '../hooks/use-redirect-target'
import { useSession } from '../hooks/use-session'

/**
 * Layout route for /login and /register.
 * - Signed in just now (on this page) → go to the redirect target, or /admin for admins.
 * - Already signed in when the page opened → say so instead of silently bouncing away.
 */
export function GuestOnly() {
  const { user, isAuthenticated } = useSession()
  const redirectTarget = useRedirectTarget()
  const [signedInOnArrival, setSignedInOnArrival] = useState(isAuthenticated)

  // After signing out here, a later sign-in must redirect normally.
  if (!isAuthenticated && signedInOnArrival) setSignedInOnArrival(false)

  if (!isAuthenticated || !user) return <Outlet />

  const target = redirectTarget ?? (user.role === 'ADMIN' ? '/admin' : '/')
  if (!signedInOnArrival) return <Navigate to={target} replace />
  return <AlreadySignedIn email={user.email} continueTo={target} />
}

type AlreadySignedInProps = {
  email: string
  continueTo: string
}

function AlreadySignedIn({ email, continueTo }: AlreadySignedInProps) {
  const clearSession = useAuthStore((s) => s.clearSession)
  return (
    <AuthCard title="Ви вже увійшли" description={`Поточний акаунт: ${email}`}>
      <div className="flex flex-col gap-3">
        <Button asChild size="lg" className="h-10">
          <Link to={continueTo} replace>
            Продовжити
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-10"
          onClick={() => {
            clearSession()
            toast.success('Ви вийшли з акаунта')
          }}
        >
          Увійти іншим акаунтом
        </Button>
      </div>
    </AuthCard>
  )
}
