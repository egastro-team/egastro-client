import { PackageXIcon } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { ProductForm, useReplaceProduct } from '@/features/admin'
import { useProduct } from '@/features/catalog'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { PageHeading } from '@/components/layout/page-heading'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getApiStatus } from '@/lib/api-error'
import { parseId } from '@/lib/parse-id'

export function AdminProductEditPage() {
  const { productId } = useParams()
  const id = parseId(productId)
  const navigate = useNavigate()
  const product = useProduct(id)
  const replaceProduct = useReplaceProduct(id ?? -1)

  if (id === null || (product.isError && getApiStatus(product.error) === 404)) {
    return (
      <EmptyState
        icon={PackageXIcon}
        title="Товар не знайдено"
        action={
          <Button asChild variant="outline">
            <Link to="/admin/products">До списку товарів</Link>
          </Button>
        }
      />
    )
  }

  return (
    <>
      <PageHeading title="Редагування товару" description={product.data?.name} />
      {product.isPending ? (
        <div className="flex max-w-2xl flex-col gap-4" aria-busy="true">
          {['a', 'b', 'c', 'd'].map((key) => (
            <Skeleton key={key} className="h-14 w-full" />
          ))}
        </div>
      ) : product.isError ? (
        <ErrorState error={product.error} onRetry={() => product.refetch()} />
      ) : (
        <ProductForm
          key={product.data.id}
          product={product.data}
          submitLabel="Зберегти зміни"
          isPending={replaceProduct.isPending}
          onCancel={() => navigate('/admin/products')}
          onSubmit={(values, { onError }) =>
            replaceProduct.mutate(values, {
              onSuccess: (updated) => {
                toast.success(`Зміни в «${updated.name}» збережено`)
                navigate('/admin/products')
              },
              onError,
            })
          }
        />
      )}
    </>
  )
}
