import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-4 py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">404</h1>
      <p className="text-muted-foreground">Сторінку не знайдено</p>
      <Button asChild>
        <Link to="/">На головну</Link>
      </Button>
    </section>
  )
}
