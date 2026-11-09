import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { FormErrorAlert } from '@/components/form/form-error-alert'
import { FormTextField } from '@/components/form/form-text-field'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { getApiStatus, getErrorMessage } from '@/lib/api-error'
import { applyServerErrors } from '@/lib/apply-server-errors'

import { useRegister } from '../api/auth-api'
import { useRedirectTarget } from '../hooks/use-redirect-target'
import { registerFormSchema, type RegisterFormValues } from '../schemas'

export function RegisterForm() {
  const navigate = useNavigate()
  const redirectTarget = useRedirectTarget()
  const registerMutation = useRegister()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = form.handleSubmit(({ email, password }) => {
    setServerError(null)
    registerMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success('Акаунт створено. Ласкаво просимо до єГастро!')
          navigate(redirectTarget ?? '/', { replace: true })
        },
        onError: (error) => {
          if (getApiStatus(error) === 409) {
            form.setError('email', { type: 'server', message: getErrorMessage(error) })
            return
          }
          setServerError(applyServerErrors(error, form.setError, ['email', 'password']))
        },
      },
    )
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <FormTextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <FormTextField
          control={form.control}
          name="password"
          label="Пароль"
          type="password"
          autoComplete="new-password"
          description="Від 8 символів, щонайменше одна цифра."
        />
        <FormTextField
          control={form.control}
          name="confirmPassword"
          label="Підтвердження пароля"
          type="password"
          autoComplete="new-password"
        />
      </FieldGroup>
      <FormErrorAlert message={serverError} />
      <Button type="submit" size="lg" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Створюємо акаунт…' : 'Зареєструватися'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Вже маєте акаунт?{' '}
        <Link
          to={redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : '/login'}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Увійти
        </Link>
      </p>
    </form>
  )
}
