import { ProductCard } from '@/features/catalog'
import { cn } from '@/lib/utils'

import type { CartRecommendations } from '../schemas'
import { AddToCartButton } from './add-to-cart-button'
import { RecommendationReason } from './recommendation-reason'

type RecommendationGridProps = {
  recommendations: CartRecommendations
  className?: string
}

/** Product cards for recommendations; model results also explain the association rule. */
export function RecommendationGrid({ recommendations, className }: RecommendationGridProps) {
  const isModel = recommendations.source === 'MODEL'
  return (
    <ul className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4', className)}>
      {recommendations.items.map((recommendation) => (
        <li key={recommendation.product.id} className="flex">
          <div className="flex w-full flex-col">
            <ProductCard
              product={recommendation.product}
              action={
                <AddToCartButton
                  productId={recommendation.product.id}
                  productName={recommendation.product.name}
                  available={recommendation.product.available}
                />
              }
              footnote={
                isModel ? <RecommendationReason recommendation={recommendation} /> : undefined
              }
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
