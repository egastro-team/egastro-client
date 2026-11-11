import { ArrowLeftIcon, PackageXIcon } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'

import { useSession } from '@/features/auth'
import { AddToCartButton, CartRecommendations, useCart } from '@/features/cart'
import { ProductDetails, useProduct } from '@/features/catalog'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getApiStatus } from '@/lib/api-error'
import { parseId } from '@/lib/parse-id'

function useBackHref() {
  const location = useLocation()
  const state: unknown = location.state
  if (state && typeof state === 'object' && 'backSearch' in state) {
    const { backSearch } = state
    if (typeof backSearch === 'string' && (backSearch === '' || backSearch.startsWith('?'))) {
      return `/${backSearch}`
    }
  }
  return '/'
}

export function ProductPage() {
  const { productId } = useParams()
  const id = parseId(productId)
  const product = useProduct(id)
  const backHref = useBackHref()
  const { isAuthenticated } = useSession()
  const { data: cart } = useCart()

  const notFound = id === null || (product.isError && getApiStatus(product.error) === 404)

  return (
    <PageContainer>
      <div>
        <Button variant="ghost" asChild className="-ml-2">
          <Link to={backHref}>
            <ArrowLeftIcon />
            Назад до каталогу
          </Link>
        </Button>
      </div>
      {notFound ? (
        <>
          <title>Товар не знайдено · єГастро</title>
          <EmptyState
            icon={PackageXIcon}
            title="Товар не знайдено"
            description="Можливо, його видалили або посилання некоректне."
            action={
              <Button asChild>
                <Link to="/">До каталогу</Link>
              </Button>
            }
          />
        </>
      ) : product.isPending ? (
        <div
          className="grid gap-6 rounded-2xl border bg-card p-4 sm:p-6 md:grid-cols-2 md:gap-10"
          aria-busy="true"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ) : product.isError ? (
        <ErrorState error={product.error} onRetry={() => product.refetch()} />
      ) : (
        <>
          <title>{`${product.data.name} · єГастро`}</title>
          <ProductDetails
            product={product.data}
            action={
              <AddToCartButton
                productId={product.data.id}
                productName={product.data.name}
                available={product.data.available}
                variant="full"
              />
            }
          />
        </>
      )}
      {isAuthenticated && (cart?.items.length ?? 0) > 0 && (
        <div className="pt-6">
          <CartRecommendations />
        </div>
      )}
    </PageContainer>
  )
}
