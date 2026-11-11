import type { ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router'

import { TooltipProvider } from '@/components/ui/tooltip'
import type { User } from '@/lib/api-schemas'
import { useAuthStore } from '@/stores/auth-store'

type RenderOptions = {
  /** Initial URL. */
  route?: string
  /** Extra routes next to the rendered element, e.g. redirect targets. */
  routes?: RouteObject[]
  /** Path pattern the element is mounted at (default `*`). */
  path?: string
  /** Child routes rendered in the element's <Outlet /> (for layout routes such as guards). */
  children?: RouteObject[]
}

/** Renders inside a fresh QueryClient (no retries) and an in-memory router. */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', routes = [], path = '*', children }: RenderOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const router = createMemoryRouter([{ path, element: ui, children }, ...routes], {
    initialEntries: [route],
  })
  const user = userEvent.setup()
  const result = render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>,
  )
  return { ...result, user, router, queryClient }
}

export function signIn(user: User = { id: 1, email: 'customer@example.com', role: 'USER' }) {
  useAuthStore.getState().setSession({ accessToken: 'test-token', expiresIn: 3600, user })
}

export function signOut() {
  useAuthStore.getState().clearSession()
}
