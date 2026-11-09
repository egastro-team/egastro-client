import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { ProductForm, useCreateProduct } from '@/features/admin'
import { PageHeading } from '@/components/layout/page-heading'

export function AdminProductNewPage() {
  const navigate = useNavigate()
  const createProduct = useCreateProduct()

  return (
    <>
      <PageHeading title="Новий товар" />
      <ProductForm
        submitLabel="Створити товар"
        isPending={createProduct.isPending}
        onCancel={() => navigate('/admin/products')}
        onSubmit={(values, { onError }) =>
          createProduct.mutate(values, {
            onSuccess: (product) => {
              toast.success(`Товар «${product.name}» створено`)
              navigate('/admin/products')
            },
            onError,
          })
        }
      />
    </>
  )
}
