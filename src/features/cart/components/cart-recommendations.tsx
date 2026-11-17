import { ArrowRightIcon, FlameIcon, SparklesIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useCartRecommendations } from '../api/cart-api'
import { RECOMMENDATIONS_LIMIT } from '../schemas'
import { RecommendationGrid } from './recommendation-grid'

type CartRecommendationsProps = {
  limit?: number
}

/**
 * "Smart cart" cross-sell panel (epic DJTJ-17, Figma: «З цим товаром часто купують (ML)»).
 * MODEL results come from market basket rules; FALLBACK results are popular products.
 */
export function CartRecommendations({ limit = RECOMMENDATIONS_LIMIT }: CartRecommendationsProps) {
  const { data, isPending, isError, refetch } = useCartRecommendations(limit)

  if (isPending) {
    return (
      <section
        aria-busy="true"
        className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-accent p-4 sm:p-6"
      >
        <Skeleton className="h-6 w-56" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: limit }, (_, i) => (
            <Skeleton key={`rec-skeleton-${i}`} className="aspect-[3/4] w-full rounded-2xl" />
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">
        Не вдалося завантажити рекомендації.{' '}
        <Button variant="link" className="h-auto p-0" onClick={() => refetch()}>
          Повторити
        </Button>
      </p>
    )
  }

  if (data.items.length === 0) return null

  const isModel = data.source === 'MODEL'
  const Icon = isModel ? SparklesIcon : FlameIcon

  return (
    <section
      aria-labelledby="cart-recommendations-title"
      className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-accent p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h2
            id="cart-recommendations-title"
            className="flex items-center gap-2 font-heading text-xl font-bold"
          >
            <Icon className="size-5 text-primary" aria-hidden />
            {isModel ? 'З цим товаром часто купують' : 'Популярне'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isModel
              ? 'Підібрано на основі товарів у вашому кошику.'
              : 'Товари, які найчастіше замовляють інші покупці.'}
          </p>
        </div>
        <Button variant="link" asChild className="h-auto p-0">
          <Link to="/recommendations">
            Більше рекомендацій
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
      <RecommendationGrid recommendations={data} className="lg:grid-cols-4" />
    </section>
  )
}
