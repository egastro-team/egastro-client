import type { ReactNode } from 'react'

type PageHeadingProps = {
  title: string
  description?: ReactNode
  actions?: ReactNode
}

/** Visible h1 plus the document title (React 19 hoists <title> into <head>). */
export function PageHeading({ title, description, actions }: PageHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <title>{`${title} · єГастро`}</title>
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  )
}
