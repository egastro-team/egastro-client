import { FolderTreeIcon, LayoutDashboardIcon, PackageIcon, ShoppingBagIcon } from 'lucide-react'
import { NavLink } from 'react-router'

import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/admin', label: 'Огляд', icon: LayoutDashboardIcon, end: true },
  { to: '/admin/orders', label: 'Замовлення', icon: ShoppingBagIcon, end: false },
  { to: '/admin/products', label: 'Товари', icon: PackageIcon, end: false },
  { to: '/admin/categories', label: 'Категорії', icon: FolderTreeIcon, end: false },
]

export function AdminNav() {
  return (
    <nav aria-label="Адмін-панель">
      <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:px-0">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="shrink-0">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex h-9 items-center gap-2 rounded-lg px-3 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                )
              }
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
