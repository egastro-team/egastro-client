import { ShieldXIcon } from 'lucide-react'
import { Link, Navigate, Outlet, useLocation } from 'react-router'

import { Button } from '@/components/ui/button'

import { useSession } from '../hooks/use-session'
import { loginPathFor } from '../hooks/use-redirect-target'

/** Layout route for /admin: USER sees "access denied", guests go to login (story DJTJ-28, AC 1). */
export function RequireAdmin() {
  const { isAuthenticated, isAdmin } = useSession()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to={loginPathFor(location)} replace />
  if (!isAdmin) return <AccessDenied />
  return <Outlet />
}

function AccessDenied() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <ShieldXIcon className="size-12 text-destructive" aria-hidden />
      <h1 className="font-heading text-2xl font-semibold">Доступ заборонено</h1>
      <p className="text-muted-foreground">
        Ця сторінка доступна лише адміністраторам. Якщо вважаєте, що це помилка, зверніться до
        адміністратора магазину.
      </p>
      <Button asChild>
        <Link to="/">До каталогу</Link>
      </Button>
    </section>
  )
}
