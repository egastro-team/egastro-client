---
paths:
  - 'src/**/*.test.ts'
  - 'src/**/*.test.tsx'
---

# Testing

- Vitest + React Testing Library. Tests sit next to the file: `product-card.tsx` → `product-card.test.tsx`.
- Query by role/label/text as a user would (`getByRole('button', { name: ... })`). Avoid `data-testid` unless nothing else works.
- Interact with `@testing-library/user-event`, not `fireEvent`.
- Components using TanStack Query are rendered inside a fresh `QueryClient` per test (`retry: false`).
- Test behavior, not implementation details (no assertions on internal state or class names).
