import { ShoppingBasketIcon } from 'lucide-react'
import { Link } from 'react-router'

import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useCartRecommendations } from '../api/cart-api'
import { RECOMMENDATIONS_PAGE_LIMIT } from '../schemas'
import { RecommendationGrid } from './recommendation-grid'

/** Full "Рекомендації для вас" page (Figma: «Більше рекомендацій ML»). */
export function RecommendationsView() {
  const { data, isPending, isError, error, refetch } = useCartRecommendations(
    RECOMMENDATIONS_PAGE_LIMIT,
  )

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4" aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={`recs-page-skeleton-${i}`} className="aspect-[3/4] w-full rounded-2xl" />
        ))}
      </div>
    )
  }
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />
  if (data.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBasketIcon}
        title="Поки що нічого порадити"
        description="Додайте товари в кошик — і тут зʼявляться товари, які з ними часто купують."
        action={
          <Button asChild>
            <Link to="/">До каталогу</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {data.source === 'MODEL'
          ? 'Підібрано на основі товарів у вашому кошику.'
          : 'Модель рекомендацій зараз недоступна, тому показуємо популярні товари.'}
      </p>
      <RecommendationGrid recommendations={data} />
    </div>
  )
}
