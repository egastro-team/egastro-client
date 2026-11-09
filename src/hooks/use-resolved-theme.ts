import { useSyncExternalStore } from 'react'

import { resolveTheme, useThemeStore } from '@/stores/theme-store'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const prefersDark = () => window.matchMedia(DARK_QUERY).matches

/** The theme actually shown: the stored preference, or the OS setting for "system". */
export function useResolvedTheme() {
  const theme = useThemeStore((s) => s.theme)
  const systemDark = useSyncExternalStore(subscribe, prefersDark, () => false)
  return resolveTheme(theme, systemDark)
}
