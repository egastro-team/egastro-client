import { Outlet } from 'react-router'

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
