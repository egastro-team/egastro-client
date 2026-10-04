# Project structure

Feature-based layout. Code that belongs to one feature lives inside that feature.

```
src/
  app/            # app wiring: providers, router, query client
  pages/          # route components — thin, compose features
  features/<name>/
    api/          # axios calls + TanStack Query hooks for this feature
    components/   # UI used only by this feature
    hooks/        # feature-specific hooks
    schemas.ts    # zod schemas + inferred types (API contracts, forms)
    index.ts      # public API — the only file other code imports from
  components/
    ui/           # shadcn/ui primitives (generated — see ui-components rule)
    layout/       # app shell: header, footer, layouts
  hooks/          # shared hooks
  stores/         # zustand stores for global client state
  lib/            # framework-agnostic helpers: api-client, env, utils
  types/          # shared types
  test/           # test setup and helpers
```

- Always import via the `@/` alias, never `../../`.
- Import other features only through their `index.ts`. No deep imports into another feature.
- Dependency direction: `pages → features → components/lib`. `components/` and `lib/` never import from `features/` or `pages/`.
- File names: `kebab-case.tsx`. Component names: `PascalCase`. Hooks: `useSomething`.
- Use named exports. No default exports (except where a tool requires it).
