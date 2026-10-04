---
paths:
  - 'src/**/*.tsx'
  - 'src/**/*.css'
---

# UI & styling (Tailwind CSS v4 + shadcn/ui)

## Tailwind

- Style with Tailwind utility classes only. No CSS modules, no inline `style={{}}` except for truly dynamic values (e.g. computed widths).
- Use semantic theme tokens, not raw palette colors: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `border-border`, `bg-destructive`, `ring-ring`. Never `bg-white`, `text-gray-500`, hex values, or arbitrary colors like `bg-[#123]`.
- New design tokens go into `src/index.css` (`:root` + `.dark` + `@theme inline`), never hard-coded in components.
- Merge conditional classes with `cn()` from `@/lib/utils`. Never build class strings with template literals.
- Component variants use `cva` (class-variance-authority), the same way shadcn components do.
- Mobile-first: base classes for mobile, then `sm:` / `md:` / `lg:`. Every screen must work at 360px width without horizontal scroll.
- Spacing via `gap-*` on flex/grid parents rather than margins on children.
- Dark mode must work: only token colors guarantee it. Check both themes when adding UI.

## shadcn/ui

- Before building any primitive (button, input, dialog, select, dropdown, tabs, card, sheet, toast, skeleton…), check whether shadcn has it and add it: `npx shadcn@latest add <component>`.
- Files in `src/components/ui/` are generated. Avoid editing them; extend by wrapping in `src/components/` or a feature. If an edit is unavoidable, keep it minimal.
- Icons: `lucide-react` only. Icon-only buttons need `aria-label`.

## Accessibility

- Use semantic elements (`button`, `a`, `nav`, `main`, `section`, headings in order). Never a clickable `div`.
- Every form control has a visible `<Label>` (or `aria-label` if visually hidden by design).
- Images have meaningful `alt` (empty `alt=""` for decorative).
- Keep focus styles visible; don't remove `outline`/`ring` without a replacement.
- UI text is in Ukrainian.
