---
paths:
  - 'src/**/*.tsx'
---

# Forms

- Forms use `react-hook-form` + `zodResolver(schema)` from `@hookform/resolvers/zod`.
- The zod schema is the single source of truth: `type FormValues = z.infer<typeof schema>`.
- Use the shadcn `form`/`field` components for label, control, description and error message.
- Validation messages in Ukrainian, defined in the schema.
- Submit through a TanStack Query mutation; disable the submit button while `isPending`; show server errors near the form.
