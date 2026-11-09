import { CategoryManager } from '@/features/admin'
import { PageHeading } from '@/components/layout/page-heading'

export function AdminCategoriesPage() {
  return (
    <>
      <PageHeading title="Категорії" />
      <div className="max-w-2xl">
        <CategoryManager />
      </div>
    </>
  )
}
