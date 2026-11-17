import { Outlet } from 'react-router'

import { AdminNav } from '@/features/admin'
import { PageContainer } from '@/components/layout/page-container'

export function AdminLayout() {
  return (
    <PageContainer>
      <div className="grid gap-6 lg:grid-cols-[13rem_1fr]">
        <aside className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
          <p className="hidden text-xs font-medium tracking-wide text-muted-foreground uppercase lg:block">
            Адмін-панель
          </p>
          <AdminNav />
        </aside>
        <div className="flex min-w-0 flex-col gap-6">
          <Outlet />
        </div>
      </div>
    </PageContainer>
  )
}
