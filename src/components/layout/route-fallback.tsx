import { Loader2Icon } from 'lucide-react'

export function RouteFallback() {
  return (
    <output className="flex min-h-[50svh] items-center justify-center">
      <Loader2Icon className="size-6 animate-spin text-muted-foreground" aria-hidden />
      <span className="sr-only">Завантаження…</span>
    </output>
  )
}
