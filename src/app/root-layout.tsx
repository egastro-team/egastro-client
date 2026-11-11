import { Outlet, ScrollRestoration } from 'react-router'

import { CartButton } from '@/features/cart'
import { HeaderSearch } from '@/features/catalog'
import { useCurrentUserSync, UserMenu } from '@/features/auth'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { ThemeToggle } from '@/components/theme-toggle'

export function RootLayout() {
  useCurrentUserSync()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Перейти до вмісту
      </a>
      <SiteHeader
        search={<HeaderSearch />}
        actions={
          <>
            <CartButton />
            <UserMenu />
          </>
        }
      />
      <main id="main" className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <SiteFooter actions={<ThemeToggle />} />
      <ScrollRestoration />
    </div>
  )
}
