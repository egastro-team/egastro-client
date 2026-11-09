import { RegisterForm } from '@/features/auth'
import { AuthCard } from '@/components/layout/auth-card'

export function RegisterPage() {
  return (
    <AuthCard title="Реєстрація" description="Створіть акаунт за хвилину">
      <RegisterForm />
    </AuthCard>
  )
}
