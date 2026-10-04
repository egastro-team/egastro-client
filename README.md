# Egastro — client

Frontend for the Egastro ML-based cross-selling system for a grocery web platform.

## Requirements

- Node.js 22+ (developed on 25)
- The Java REST API running locally (default `http://localhost:8080`)

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

## Scripts

| Script                            | Description                                  |
| --------------------------------- | -------------------------------------------- |
| `npm run dev`                     | Start the dev server (http://localhost:5173) |
| `npm run build`                   | Typecheck and build for production           |
| `npm run preview`                 | Preview the production build                 |
| `npm run typecheck`               | Run the TypeScript compiler                  |
| `npm run lint` / `lint:fix`       | Lint with oxlint                             |
| `npm run format` / `format:check` | Format with Prettier                         |
| `npm run test` / `test:run`       | Run tests with Vitest                        |

## Stack

React 19, TypeScript, Vite, React Router, TanStack Query, axios, zod, react-hook-form, zustand, Tailwind CSS v4, shadcn/ui, Vitest, Testing Library, oxlint, Prettier.
