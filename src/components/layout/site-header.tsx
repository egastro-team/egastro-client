import type { ReactNode } from 'react'

import { Logo } from './logo'

type SiteHeaderProps = {
  /** Right-hand actions (cart, account) — provided by the app shell from features. */
  actions?: ReactNode
}

export function SiteHeader({ actions }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4">
        <Logo />
        <div className="flex items-center gap-1">{actions}</div>
      </div>
    </header>
  )
}
