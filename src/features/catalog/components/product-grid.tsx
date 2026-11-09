import type { ReactNode } from 'react'
import { SearchXIcon } from 'lucide-react'

import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { Skeleton } from '@/components/ui/skeleton'

import type { Product } from '../schemas'
import { ProductCard } from './product-card'

type ProductGridProps = {
  products: Product[] | undefined
  isPending: boolean
  error: unknown
  onRetry: () => void
  backSearch?: string
  renderAction?: (product: Product) => ReactNode
  emptyAction?: ReactNode
}

export function ProductGrid({
  products,
  isPending,
  error,
  onRetry,
  backSearch,
  renderAction,
  emptyAction,
}: ProductGridProps) {
  if (isPending) return <ProductGridSkeleton />
  if (error || !products) return <ErrorState error={error} onRetry={onRetry} />
  if (products.length === 0) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title="Товарів не знайдено"
        description="Спробуйте іншу категорію або змініть пошуковий запит."
        action={emptyAction}
      />
    )
  }
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="flex">
          <div className="flex w-full flex-col">
            <ProductCard
              product={product}
              backSearch={backSearch}
              action={renderAction?.(product)}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

const SKELETON_KEYS = Array.from({ length: 8 }, (_, i) => `skeleton-${i}`)

function ProductGridSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4" aria-busy="true">
      {SKELETON_KEYS.map((key) => (
        <li key={key} className="flex flex-col overflow-hidden rounded-xl border">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  )
}
