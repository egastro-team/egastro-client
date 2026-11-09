import { screen } from '@testing-library/react'

import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'
import { apiError } from '@/test/api-error'
import { renderWithProviders } from '@/test/render'

import { LoginForm } from './login-form'

describe('LoginForm', () => {
  it('shows one generic message for wrong credentials', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValue(
      apiError(401, 'Incorrect email or password', undefined, '/auth/login'),
    )
    const { user } = renderWithProviders(<LoginForm />)
    await user.type(screen.getByLabelText('Email'), 'customer@example.com')
    await user.type(screen.getByLabelText('Пароль'), 'wrong-password1')
    await user.click(screen.getByRole('button', { name: 'Увійти' }))
    expect(await screen.findByText('Невірний email або пароль')).toBeInTheDocument()
  })

  it('stores the session and returns to the redirect target', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: {
        accessToken: 'jwt',
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: { id: 7, email: 'customer@example.com', role: 'USER' },
      },
    })
    const { user } = renderWithProviders(<LoginForm />, {
      route: '/login?redirect=%2Fcart',
      path: '/login',
      routes: [{ path: '/cart', element: <p>Сторінка кошика</p> }],
    })
    await user.type(screen.getByLabelText('Email'), '  customer@example.com ')
    await user.type(screen.getByLabelText('Пароль'), ' Secret123')
    await user.click(screen.getByRole('button', { name: 'Увійти' }))

    expect(await screen.findByText('Сторінка кошика')).toBeInTheDocument()
    // Email is trimmed, password is sent as typed.
    expect(post).toHaveBeenCalledWith('/auth/login', {
      email: 'customer@example.com',
      password: ' Secret123',
    })
    expect(useAuthStore.getState().user?.id).toBe(7)
  })
})
