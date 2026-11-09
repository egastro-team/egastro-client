import { Navigate, Outlet, useLocation } from 'react-router'

import { useSession } from '../hooks/use-session'
import { loginPathFor } from '../hooks/use-redirect-target'

/** Layout route: unauthenticated visitors are sent to login and brought back afterwards. */
export function RequireAuth() {
  const { isAuthenticated } = useSession()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to={loginPathFor(location)} replace />
  return <Outlet />
}
