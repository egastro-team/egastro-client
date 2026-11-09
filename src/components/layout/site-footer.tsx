const CURRENT_YEAR = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {CURRENT_YEAR} єГастро</p>
        <p>Розумний кошик: рекомендації на основі аналізу покупок</p>
      </div>
    </footer>
  )
}
