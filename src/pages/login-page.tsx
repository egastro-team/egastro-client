import { LoginForm } from '@/features/auth'
import { AuthCard } from '@/components/layout/auth-card'

export function LoginPage() {
  return (
    <AuthCard title="З поверненням!" description="Увійдіть, щоб побачити свої рекомендації">
      <LoginForm />
    </AuthCard>
  )
}
