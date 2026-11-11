import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { FormErrorAlert } from '@/components/form/form-error-alert'
import { FormTextField } from '@/components/form/form-text-field'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { getApiStatus } from '@/lib/api-error'
import { applyServerErrors } from '@/lib/apply-server-errors'

import { useLogin } from '../api/auth-api'
import { useRedirectTarget } from '../hooks/use-redirect-target'
import { loginFormSchema, type LoginFormValues } from '../schemas'

export function LoginForm() {
  const redirectTarget = useRedirectTarget()
  const login = useLogin()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = form.handleSubmit((values) => {
    setServerError(null)
    // Success navigation happens in GuestOnly: the session update unmounts this form,
    // so per-call onSuccess callbacks would never run.
    login.mutate(values, {
      onError: (error) => {
        // One generic message for unknown email and wrong password alike (story DJTJ-25, AC 2).
        if (getApiStatus(error) === 401) {
          setServerError('Невірний email або пароль')
          return
        }
        setServerError(applyServerErrors(error, form.setError, ['email', 'password']))
      },
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <FormTextField
          control={form.control}
          name="email"
          label="Електронна пошта"
          type="email"
          autoComplete="email"
          placeholder="mail@example.com"
        />
        <FormTextField
          control={form.control}
          name="password"
          label="Пароль"
          type="password"
          autoComplete="current-password"
        />
      </FieldGroup>
      <FormErrorAlert message={serverError} />
      <Button type="submit" size="lg" className="h-10" disabled={login.isPending}>
        {login.isPending ? 'Входимо…' : 'Увійти'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Немає акаунту?{' '}
        <Link
          to={
            redirectTarget
              ? `/register?redirect=${encodeURIComponent(redirectTarget)}`
              : '/register'
          }
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Створити зараз
        </Link>
      </p>
    </form>
  )
}
