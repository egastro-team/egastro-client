import { FlameIcon, SparklesIcon } from 'lucide-react'

import { ProductCard } from '@/features/catalog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useCartRecommendations } from '../api/cart-api'
import { RECOMMENDATIONS_LIMIT } from '../schemas'
import { AddToCartButton } from './add-to-cart-button'
import { RecommendationReason } from './recommendation-reason'

type CartRecommendationsProps = {
  limit?: number
}

/**
 * "Smart cart" cross-sell block (epic DJTJ-17). MODEL results come from market basket rules;
 * FALLBACK results are popular products and are labelled as such.
 */
export function CartRecommendations({ limit = RECOMMENDATIONS_LIMIT }: CartRecommendationsProps) {
  const { data, isPending, isError, refetch } = useCartRecommendations(limit)

  if (isPending) {
    return (
      <section aria-busy="true" className="flex flex-col gap-4">
        <Skeleton className="h-6 w-56" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: limit }, (_, i) => (
            <Skeleton key={`rec-skeleton-${i}`} className="aspect-[3/4] w-full rounded-xl" />
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
    <section aria-labelledby="cart-recommendations-title" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2
          id="cart-recommendations-title"
          className="flex items-center gap-2 font-heading text-xl font-semibold"
        >
          <Icon className="size-5 text-primary" aria-hidden />
          {isModel ? 'Часто купують разом' : 'Популярне'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isModel
            ? 'Підібрано на основі товарів у вашому кошику.'
            : 'Товари, які найчастіше замовляють інші покупці.'}
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {data.items.map((recommendation) => (
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
    </section>
  )
}
