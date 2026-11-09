import type { ReactNode } from 'react'

type AuthCardProps = {
  title: string
  description: string
  children: ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="flex flex-1 items-start justify-center px-4 py-10 sm:items-center">
      <title>{`${title} · єГастро`}</title>
      <section className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </section>
    </div>
  )
}
