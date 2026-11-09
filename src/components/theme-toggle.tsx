import { MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useResolvedTheme } from '@/hooks/use-resolved-theme'
import { useThemeStore } from '@/stores/theme-store'

export function ThemeToggle() {
  const resolved = useResolvedTheme()
  const setTheme = useThemeStore((s) => s.setTheme)
  const isDark = resolved === 'dark'
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? 'Світла тема' : 'Темна тема'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
