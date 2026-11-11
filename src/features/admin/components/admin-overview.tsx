import type { LucideIcon } from 'lucide-react'
import { FolderTreeIcon, PackageIcon, ShoppingBagIcon } from 'lucide-react'
import { Link } from 'react-router'

import { useCategories, useProducts } from '@/features/catalog'
import { Skeleton } from '@/components/ui/skeleton'

import { useAdminOrders } from '../api/admin-api'

export function AdminOverview() {
  const newOrders = useAdminOrders({ status: 'NEW', page: 0, size: 1 })
  const products = useProducts({ page: 0, size: 1 })
  const categories = useCategories()

  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      <StatCard
        to="/admin/orders?status=NEW"
        icon={ShoppingBagIcon}
        label="Нові замовлення"
        value={newOrders.data?.totalElements}
        isError={newOrders.isError}
      />
      <StatCard
        to="/admin/products"
        icon={PackageIcon}
        label="Товарів у каталозі"
        value={products.data?.totalElements}
        isError={products.isError}
      />
      <StatCard
        to="/admin/categories"
        icon={FolderTreeIcon}
        label="Категорій"
        value={categories.data?.length}
        isError={categories.isError}
      />
    </ul>
  )
}

type StatCardProps = {
  to: string
  icon: LucideIcon
  label: string
  value: number | undefined
  isError: boolean
}

function StatCard({ to, icon: Icon, label, value, isError }: StatCardProps) {
  return (
    <li>
      <Link
        to={to}
        className="flex flex-col gap-3 rounded-2xl border bg-card p-4 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Icon className="size-5 text-primary" aria-hidden />
        {isError ? (
          <span className="text-sm text-muted-foreground">Не вдалося завантажити</span>
        ) : value === undefined ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <span className="text-3xl font-semibold tabular-nums">{value}</span>
        )}
        <span className="text-sm text-muted-foreground">{label}</span>
      </Link>
    </li>
  )
}
