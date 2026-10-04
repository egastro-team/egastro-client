---
paths:
  - 'src/**/*.tsx'
---

# React components

- Function components only, typed props via a `type XxxProps = {...}` declared above the component.
- React 19 + automatic JSX runtime: never `import React`. Import types with `import type`.
- One exported component per file. Small private helpers in the same file are fine.
- Keep components presentational where possible; put data fetching in feature hooks (`useProducts`, `useRecommendations`), not inline in JSX files.
- Do not use `useEffect` to fetch data or to derive state — use TanStack Query and compute during render.
- No `React.FC`. No `any`. No non-null `!` except the root mount in `main.tsx`.
- Lists need stable `key`s from data ids, never array index for dynamic lists.
- Every async UI state has three branches: loading (skeleton), error (message + retry), empty (explicit empty state).
- Pages are lazy-loadable: keep page modules free of side effects at import time.
