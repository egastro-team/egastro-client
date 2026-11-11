import type { ReactNode } from 'react'

import { Logo } from './logo'

type SiteHeaderProps = {
  /** Search box (catalog feature), centred on desktop and on its own row on mobile. */
  search?: ReactNode
  /** Right-hand icons (cart, account) — provided by the app shell from features. */
  actions?: ReactNode
}

export function SiteHeader({ search, actions }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 md:flex-nowrap">
        <Logo />
        {search && (
          <div className="order-last w-full md:order-none md:mx-auto md:max-w-xl md:flex-1">
            {search}
          </div>
        )}
        <div className="ml-auto flex items-center gap-1 md:ml-0">{actions}</div>
      </div>
    </header>
  )
}
