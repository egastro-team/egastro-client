import { Toaster } from '@/components/ui/sonner'
import { useResolvedTheme } from '@/hooks/use-resolved-theme'

export function AppToaster() {
  const theme = useResolvedTheme()
  return <Toaster theme={theme} position="top-center" richColors closeButton />
}
