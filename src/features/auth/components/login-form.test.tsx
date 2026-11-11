import { screen } from '@testing-library/react'

import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'
import { apiError } from '@/test/api-error'
import { renderWithProviders } from '@/test/render'

import { GuestOnly } from './guest-only'
import { LoginForm } from './login-form'

function loginResponse(role: 'USER' | 'ADMIN') {
  return {
    data: {
      accessToken: 'jwt',
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: { id: 7, email: 'customer@example.com', role },
    },
  }
}

/** Renders the login form inside its real GuestOnly layout route, like the app router does. */
function renderLogin(route = '/login') {
  return renderWithProviders(<GuestOnly />, {
    route,
    path: '/login',
    children: [{ index: true, element: <LoginForm /> }],
    routes: [
      { path: '/', element: <p>Каталог</p> },
      { path: '/cart', element: <p>Сторінка кошика</p> },
      { path: '/admin', element: <p>Адмін-панель</p> },
    ],
  })
}

async function submit(
  user: ReturnType<typeof renderWithProviders>['user'],
  email: string,
  password: string,
) {
  await user.type(screen.getByLabelText('Електронна пошта'), email)
  await user.type(screen.getByLabelText('Пароль'), password)
  await user.click(screen.getByRole('button', { name: 'Увійти' }))
}

describe('LoginForm', () => {
  it('shows one generic message for wrong credentials', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValue(
      apiError(401, 'Incorrect email or password', undefined, '/auth/login'),
    )
    const { user } = renderLogin()
    await submit(user, 'customer@example.com', 'wrong-password1')
    expect(await screen.findByText('Невірний email або пароль')).toBeInTheDocument()
  })

  it('stores the session and returns to the redirect target', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue(loginResponse('USER'))
    const { user } = renderLogin('/login?redirect=%2Fcart')
    await submit(user, '  customer@example.com ', ' Secret123')

    expect(await screen.findByText('Сторінка кошика')).toBeInTheDocument()
    // Email is trimmed, password is sent as typed.
    expect(post).toHaveBeenCalledWith('/auth/login', {
      email: 'customer@example.com',
      password: ' Secret123',
    })
    expect(useAuthStore.getState().user?.id).toBe(7)
  })

  it('sends an admin to the admin panel when there is no redirect target', async () => {
    vi.spyOn(apiClient, 'post').mockResolvedValue(loginResponse('ADMIN'))
    const { user } = renderLogin()
    await submit(user, 'admin@example.com', 'Secret12345')
    expect(await screen.findByText('Адмін-панель')).toBeInTheDocument()
  })

  it('can reveal the typed password', async () => {
    const { user } = renderLogin()
    const password = screen.getByLabelText('Пароль')
    expect(password).toHaveAttribute('type', 'password')
    await user.click(screen.getByRole('button', { name: 'Показати пароль' }))
    expect(password).toHaveAttribute('type', 'text')
  })
})
