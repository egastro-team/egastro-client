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
      <div className="flex gap-2 lg:flex-col">
        {['a', 'b', 'c', 'd'].map((key) => (
          <Skeleton key={key} className="h-8 w-24 lg:w-full" />
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
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
        {items.map((category) => {
          const active = (category.id ?? undefined) === activeCategoryId
          return (
            <li key={category.id ?? 'all'} className="shrink-0">
              <Link
                to={hrefFor(category.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-8 items-center rounded-full border px-3 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:h-9 lg:rounded-lg lg:border-transparent',
                  active
                    ? 'border-primary bg-primary text-primary-foreground lg:border-transparent'
                    : 'hover:bg-muted',
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
