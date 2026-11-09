import { LoginForm } from '@/features/auth'
import { AuthCard } from '@/components/layout/auth-card'

export function LoginPage() {
  return (
    <AuthCard title="Вхід" description="Увійдіть, щоб оформлювати замовлення">
      <LoginForm />
    </AuthCard>
  )
}
