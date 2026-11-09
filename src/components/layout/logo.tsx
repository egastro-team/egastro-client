import { LeafIcon } from 'lucide-react'
import { Link } from 'react-router'

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 rounded-md font-heading text-lg font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <LeafIcon className="size-4" aria-hidden />
      </span>
      єГастро
    </Link>
  )
}
