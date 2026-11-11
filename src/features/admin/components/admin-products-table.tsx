import { PackageSearchIcon, PencilIcon, PlusIcon } from 'lucide-react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import {
  AvailabilityBadge,
  CatalogToolbar,
  ProductImage,
  useCatalogParams,
  useCategories,
  useProducts,
} from '@/features/catalog'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { PaginationNav } from '@/components/pagination-nav'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getErrorMessage } from '@/lib/api-error'
import { formatUnitPrice } from '@/lib/format'

import { useDeleteProduct } from '../api/admin-api'
import { ConfirmDeleteButton } from './confirm-delete-button'

const ALL_CATEGORIES = 'all'

/** Admin product list reuses the public catalog endpoint (there are no admin catalog GETs). */
export function AdminProductsTable() {
  const params = useCatalogParams()
  const products = useProducts(params.apiParams)
  const categories = useCategories()
  const deleteProduct = useDeleteProduct()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex-1">
          <CatalogToolbar
            key={params.q ?? ''}
            query={params.q}
            sort={params.sort}
            onSearch={(q) => params.update({ q })}
            onSortChange={(sort) => params.update({ sort })}
          />
        </div>
        <Select
          value={params.category ? String(params.category) : ALL_CATEGORIES}
          onValueChange={(value) =>
            params.update({ category: value === ALL_CATEGORIES ? null : Number(value) })
          }
        >
          <SelectTrigger className="h-9 w-full lg:w-52" aria-label="Фільтр за категорією">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>Усі категорії</SelectItem>
            {categories.data?.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {products.isPending ? (
        <div className="flex flex-col gap-2" aria-busy="true">
          {['a', 'b', 'c', 'd', 'e'].map((key) => (
            <Skeleton key={key} className="h-14 w-full" />
          ))}
        </div>
      ) : products.isError ? (
        <ErrorState error={products.error} onRetry={() => products.refetch()} />
      ) : products.data.content.length === 0 ? (
        <EmptyState
          icon={PackageSearchIcon}
          title="Товарів не знайдено"
          action={
            <Button asChild>
              <Link to="/admin/products/new">
                <PlusIcon />
                Додати товар
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Знайдено: {products.data.totalElements}</p>
          <div className="overflow-x-auto rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead className="hidden md:table-cell">Категорія</TableHead>
                  <TableHead>Ціна</TableHead>
                  <TableHead className="hidden sm:table-cell">Статус</TableHead>
                  <TableHead className="w-24 text-right">
                    <span className="sr-only">Дії</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.data.content.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ProductImage
                          src={product.imageUrl}
                          alt=""
                          className="size-10 shrink-0 rounded-md"
                        />
                        <Link
                          to={`/products/${product.id}`}
                          className="max-w-40 truncate font-medium underline-offset-4 hover:underline sm:max-w-64"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{product.categoryName}</TableCell>
                    <TableCell className="tabular-nums">
                      {formatUnitPrice(product.price, product.unitOfMeasure)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <AvailabilityBadge available={product.available} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            aria-label={`Редагувати «${product.name}»`}
                          >
                            <PencilIcon />
                          </Link>
                        </Button>
                        <ConfirmDeleteButton
                          title={`Видалити «${product.name}»?`}
                          description="Товар зникне з каталогу та з кошиків покупців. Уже оформлені замовлення не зміняться."
                          ariaLabel={`Видалити «${product.name}»`}
                          disabled={deleteProduct.isPending}
                          onConfirm={() =>
                            deleteProduct.mutate(product.id, {
                              onSuccess: () => toast.success(`«${product.name}» видалено`),
                              onError: (error) => toast.error(getErrorMessage(error)),
                            })
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <PaginationNav
            page={params.page}
            totalPages={products.data.totalPages}
            hrefFor={(page) => params.buildSearch({ page }) || '?'}
          />
        </>
      )}
    </div>
  )
}
