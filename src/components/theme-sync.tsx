import { useEffect } from 'react'

import { useResolvedTheme } from '@/hooks/use-resolved-theme'

/** Mirrors the resolved theme onto <html class="dark"> (the initial value is set in index.html). */
export function ThemeSync() {
  const resolved = useResolvedTheme()
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolved === 'dark')
    root.style.colorScheme = resolved
  }, [resolved])
  return null
}
