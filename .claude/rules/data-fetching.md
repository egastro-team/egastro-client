---
paths:
  - 'src/features/**'
  - 'src/lib/**'
  - 'src/app/**'
---

# Data fetching (Java REST API)

- All HTTP goes through `apiClient` from `@/lib/api-client` (axios). Never call `fetch`/`axios` directly in components.
- Base URL comes from `env.VITE_API_BASE_URL` (`@/lib/env`). In dev `/api` is proxied to the Java backend (`VITE_API_PROXY_TARGET`, default `http://localhost:8080`).
- Validate every response with a zod schema in the feature's `schemas.ts`; derive TS types with `z.infer`. Don't hand-write API types that duplicate a schema.
- Server state lives in TanStack Query only. Do not copy server data into zustand or `useState`.
- Query keys: one factory per feature, e.g.
  ```ts
  export const productKeys = {
    all: ['products'] as const,
    list: (params: ProductListParams) => [...productKeys.all, 'list', params] as const,
    detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  }
  ```
- Wrap queries in hooks (`useProduct(id)`), and expose `queryOptions(...)` objects so they can be reused for prefetching.
- Mutations invalidate the affected query keys in `onSuccess`. Use optimistic updates only for cart-like interactions.
- Recommendations (cross-sell) are separate queries from the product itself, so a slow ML response never blocks the product page.
- `zustand` is for client-only state (cart UI, filters, UI preferences). Keep stores small and use selectors: `useCartStore((s) => s.items)`.
