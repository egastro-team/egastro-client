import { XIcon } from 'lucide-react'
import { useLocation } from 'react-router'

import { AddToCartButton } from '@/features/cart'
import {
  CategoryNav,
  ProductGrid,
  PromoBanner,
  SortSelect,
  useCatalogParams,
  useCategories,
  useProducts,
} from '@/features/catalog'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeading } from '@/components/layout/page-heading'
import { PaginationNav } from '@/components/pagination-nav'
import { Button } from '@/components/ui/button'
import { pluralize } from '@/lib/format'

export function CatalogPage() {
  const location = useLocation()
  const params = useCatalogParams()
  const products = useProducts(params.apiParams)
  const categories = useCategories()

  const activeCategory = categories.data?.find((category) => category.id === params.category)
  const title = activeCategory ? `Каталог: ${activeCategory.name}` : 'Каталог'
  const total = products.data?.totalElements
  const showBanner = !params.q && !params.category && params.page === 1

  return (
    <PageContainer>
      {showBanner && <PromoBanner />}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <PageHeading
            title={title}
            description={
              total !== undefined
                ? `${total} ${pluralize(total, 'товар', 'товари', 'товарів')}`
                : undefined
            }
          />
          <SortSelect value={params.sort} onChange={(sort) => params.update({ sort })} />
        </div>
        <CategoryNav
          activeCategoryId={params.category}
          hrefFor={(category) => params.buildSearch({ category }) || '/'}
        />
        {params.q && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Результати пошуку:</span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => params.update({ q: null })}
              aria-label={`Скинути пошук «${params.q}»`}
            >
              «{params.q}»
              <XIcon />
            </Button>
          </div>
        )}
      </div>
      <ProductGrid
        products={products.data?.content}
        isPending={products.isPending}
        error={products.error}
        onRetry={() => products.refetch()}
        backSearch={location.search}
        renderAction={(product) => (
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            available={product.available}
          />
        )}
        emptyAction={
          params.q || params.category ? (
            <Button variant="outline" onClick={() => params.update({ q: null, category: null })}>
              Скинути фільтри
            </Button>
          ) : undefined
        }
      />
      {products.data && (
        <PaginationNav
          page={params.page}
          totalPages={products.data.totalPages}
          hrefFor={(page) => params.buildSearch({ page }) || '/'}
        />
      )}
    </PageContainer>
  )
}
