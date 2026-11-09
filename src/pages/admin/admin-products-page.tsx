import { PlusIcon } from 'lucide-react'
import { Link } from 'react-router'

import { AdminProductsTable } from '@/features/admin'
import { PageHeading } from '@/components/layout/page-heading'
import { Button } from '@/components/ui/button'

export function AdminProductsPage() {
  return (
    <>
      <PageHeading
        title="Товари"
        actions={
          <Button asChild>
            <Link to="/admin/products/new">
              <PlusIcon />
              Новий товар
            </Link>
          </Button>
        }
      />
      <AdminProductsTable />
    </>
  )
}
