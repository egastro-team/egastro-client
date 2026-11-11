import type { ReactNode } from 'react'

import { BrandName } from './brand-name'

const CURRENT_YEAR = new Date().getFullYear()

type SiteFooterProps = {
  actions?: ReactNode
}

export function SiteFooter({ actions }: SiteFooterProps) {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-muted-foreground">
        <p>
          © {CURRENT_YEAR} <BrandName className="font-semibold" /> — розумний кошик для ваших
          покупок
        </p>
        {actions}
      </div>
    </footer>
  )
}
