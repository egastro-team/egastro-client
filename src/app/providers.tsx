import { useEffect, type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClient } from '@/app/query-client'
import { AppToaster } from '@/components/app-toaster'
import { ThemeSync } from '@/components/theme-sync'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAuthStore } from '@/stores/auth-store'

/** Query roots that belong to the signed-in user and must not leak into another session. */
const PRIVATE_QUERY_ROOTS = new Set(['auth', 'cart', 'orders', 'admin'])

function useDropPrivateDataOnSessionChange() {
  useEffect(
    () =>
      useAuthStore.subscribe((state, previous) => {
        if (state.accessToken === previous.accessToken) return
        queryClient.removeQueries({
          predicate: (query) => PRIVATE_QUERY_ROOTS.has(String(query.queryKey[0])),
        })
      }),
    [],
  )
}

export function Providers({ children }: { children: ReactNode }) {
  useDropPrivateDataOnSessionChange()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <TooltipProvider>
        {children}
        <AppToaster />
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}
