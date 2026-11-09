import { QueryClient } from '@tanstack/react-query'

import { getApiStatus } from '@/lib/api-error'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      // Client errors (401/403/404/409…) will not change on retry.
      retry: (failureCount, error) => {
        const status = getApiStatus(error)
        if (status !== null && status >= 400 && status < 500) return false
        return failureCount < 1
      },
      refetchOnWindowFocus: false,
    },
  },
})
