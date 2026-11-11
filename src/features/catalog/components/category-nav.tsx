import { Link } from 'react-router'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { useCategories } from '../api/catalog-api'

type CategoryNavProps = {
  activeCategoryId?: number
  hrefFor: (categoryId: number | null) => string
}

/** Horizontal chips on mobile, a vertical list from `lg`. The active category is highlighted. */
export function CategoryNav({ activeCategoryId, hrefFor }: CategoryNavProps) {
  const { data: categories, isPending, isError, refetch } = useCategories()

  if (isPending) {
    return (
      <div className="flex gap-2">
        {['a', 'b', 'c', 'd'].map((key) => (
          <Skeleton key={key} className="h-9 w-24 rounded-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">
        Не вдалося завантажити категорії.{' '}
        <button type="button" className="text-primary underline" onClick={() => refetch()}>
          Повторити
        </button>
      </p>
    )
  }

  const items = [{ id: null, name: 'Усі товари' }, ...categories]

  return (
    <nav aria-label="Категорії">
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {items.map((category) => {
          const active = (category.id ?? undefined) === activeCategoryId
          return (
            <li key={category.id ?? 'all'} className="shrink-0">
              <Link
                to={hrefFor(category.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-9 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-card hover:border-primary/40 hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {category.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
