# Egastro — client

Frontend for "Egastro": an ML-based cross-selling system for a grocery web platform. The backend is a separate Java REST API.

## Stack

Vite 8 · React 19 · TypeScript (strict) · React Router 8 (data mode) · TanStack Query 5 · axios · zod 4 · react-hook-form · zustand · Tailwind CSS v4 · shadcn/ui (Radix, lucide icons) · Vitest + Testing Library · oxlint · Prettier

## Commands

- `npm run dev` — dev server on :5173, `/api` proxied to the backend (`VITE_API_PROXY_TARGET`, default :8080)
- `npm run build` — typecheck + production build
- `npm run typecheck` · `npm run lint` · `npm run format` · `npm run test:run`
- `npx shadcn@latest add <component>` — add a UI primitive

Before saying a change is done, run `npm run typecheck && npm run lint && npm run test:run`.

Detailed conventions live in `.claude/rules/`.
