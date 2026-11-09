import { screen } from '@testing-library/react'

import { apiClient } from '@/lib/api-client'
import { apiError } from '@/test/api-error'
import { renderWithProviders } from '@/test/render'

import { RegisterForm } from './register-form'

async function fill(
  user: ReturnType<typeof renderWithProviders>['user'],
  password: string,
  confirm = password,
) {
  await user.type(screen.getByLabelText('Email'), 'new@example.com')
  await user.type(screen.getByLabelText('Пароль'), password)
  await user.type(screen.getByLabelText('Підтвердження пароля'), confirm)
  await user.click(screen.getByRole('button', { name: 'Зареєструватися' }))
}

describe('RegisterForm', () => {
  it('shows the broken password rule and does not call the API', async () => {
    const post = vi.spyOn(apiClient, 'post')
    const { user } = renderWithProviders(<RegisterForm />)
    await fill(user, 'abcdefgh')
    expect(await screen.findByText('Пароль має містити хоча б одну цифру')).toBeInTheDocument()
    expect(post).not.toHaveBeenCalled()
  })

  it('requires matching passwords', async () => {
    const { user } = renderWithProviders(<RegisterForm />)
    await fill(user, 'Secret123', 'Secret124')
    expect(await screen.findByText('Паролі не збігаються')).toBeInTheDocument()
  })

  it('validates the email format', async () => {
    const { user } = renderWithProviders(<RegisterForm />)
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Зареєструватися' }))
    expect(await screen.findByText('Некоректний формат email')).toBeInTheDocument()
  })

  it('shows the duplicate email error from the API next to the field', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValue(
      apiError(409, 'A user with this email already exists', undefined, '/auth/register'),
    )
    const { user } = renderWithProviders(<RegisterForm />)
    await fill(user, 'Secret123')
    expect(await screen.findByText('Користувач з таким email уже існує')).toBeInTheDocument()
  })
})
