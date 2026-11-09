import { useLocation } from 'react-router'

import { AddToCartButton } from '@/features/cart'
import {
  CatalogToolbar,
  CategoryNav,
  ProductGrid,
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
  const title = activeCategory?.name ?? 'Усі товари'
  const total = products.data?.totalElements

  return (
    <PageContainer>
      <PageHeading
        title={title}
        description={
          params.q
            ? `Результати пошуку «${params.q}»${total !== undefined ? `: ${total}` : ''}`
            : total !== undefined
              ? `${total} ${pluralize(total, 'товар', 'товари', 'товарів')}`
              : undefined
        }
      />
      <div className="grid gap-6 lg:grid-cols-[14rem_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <CategoryNav
            activeCategoryId={params.category}
            hrefFor={(category) => params.buildSearch({ category }) || '/'}
          />
        </aside>
        <div className="flex min-w-0 flex-col gap-6">
          <CatalogToolbar
            key={params.q ?? ''}
            query={params.q}
            sort={params.sort}
            onSearch={(q) => params.update({ q })}
            onSortChange={(sort) => params.update({ sort })}
          />
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
                <Button
                  variant="outline"
                  onClick={() => params.update({ q: null, category: null })}
                >
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
        </div>
      </div>
    </PageContainer>
  )
}
