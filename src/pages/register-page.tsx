import { RegisterForm } from '@/features/auth'
import { AuthCard } from '@/components/layout/auth-card'

export function RegisterPage() {
  return (
    <AuthCard title="Створити акаунт">
      <RegisterForm />
    </AuthCard>
  )
}
