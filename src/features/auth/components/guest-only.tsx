import { Navigate, Outlet } from 'react-router'

import { useSession } from '../hooks/use-session'
import { useRedirectTarget } from '../hooks/use-redirect-target'

/** Layout route for login/register: signed-in users skip straight to where they were going. */
export function GuestOnly() {
  const { isAuthenticated } = useSession()
  const redirectTarget = useRedirectTarget()
  if (isAuthenticated) return <Navigate to={redirectTarget ?? '/'} replace />
  return <Outlet />
}
