import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

import { Button } from '@/components/ui/button'

/** Last-resort error screen for render/loader errors. */
export function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Сталася неочікувана помилка.'

  return (
    <section className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-heading text-2xl font-semibold">Щось пішло не так</h1>
      <p className="text-muted-foreground">{message}</p>
      <div className="flex gap-2">
        <Button onClick={() => window.location.reload()}>Оновити сторінку</Button>
        <Button variant="outline" asChild>
          <Link to="/">На головну</Link>
        </Button>
      </div>
    </section>
  )
}
