import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { getPageItems } from '@/lib/pagination'

type PaginationNavProps = {
  /** 1-based current page. */
  page: number
  totalPages: number
  /** Link target for a 1-based page, e.g. `?page=3`. */
  hrefFor: (page: number) => string
}

export function PaginationNav({ page, totalPages, hrefFor }: PaginationNavProps) {
  if (totalPages <= 1) return null
  const items = getPageItems(page, totalPages)

  return (
    <nav aria-label="Сторінки" className="flex flex-wrap items-center justify-center gap-1">
      <PageLink to={page > 1 ? hrefFor(page - 1) : null} label="Попередня сторінка">
        <ChevronLeftIcon />
      </PageLink>
      {items.map((item, index) =>
        item === null ? (
          <span key={`gap-${index}`} className="px-1 text-muted-foreground" aria-hidden>
            …
          </span>
        ) : (
          <Button
            key={item}
            asChild
            size="icon"
            variant={item === page ? 'default' : 'ghost'}
            aria-current={item === page ? 'page' : undefined}
          >
            <Link to={hrefFor(item)} aria-label={`Сторінка ${item}`}>
              {item}
            </Link>
          </Button>
        ),
      )}
      <PageLink to={page < totalPages ? hrefFor(page + 1) : null} label="Наступна сторінка">
        <ChevronRightIcon />
      </PageLink>
    </nav>
  )
}

type PageLinkProps = {
  to: string | null
  label: string
  children: ReactNode
}

function PageLink({ to, label, children }: PageLinkProps) {
  if (!to) {
    return (
      <Button size="icon" variant="ghost" disabled aria-label={label}>
        {children}
      </Button>
    )
  }
  return (
    <Button asChild size="icon" variant="ghost">
      <Link to={to} aria-label={label}>
        {children}
      </Link>
    </Button>
  )
}
