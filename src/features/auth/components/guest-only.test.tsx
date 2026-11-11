import { screen } from '@testing-library/react'

import { renderWithProviders, signIn } from '@/test/render'

import { GuestOnly } from './guest-only'

function renderGuestOnly() {
  return renderWithProviders(<GuestOnly />, {
    route: '/login',
    path: '/login',
    children: [{ index: true, element: <p>Форма входу</p> }],
    routes: [{ path: '/', element: <p>Каталог</p> }],
  })
}

describe('GuestOnly', () => {
  it('shows the login form to guests', async () => {
    renderGuestOnly()
    expect(await screen.findByText('Форма входу')).toBeInTheDocument()
  })

  it('explains an existing session instead of silently redirecting', async () => {
    signIn({ id: 1, email: 'demo@egastro.ua', role: 'USER' })
    renderGuestOnly()
    expect(await screen.findByRole('heading', { name: 'Ви вже увійшли' })).toBeInTheDocument()
    expect(screen.getByText('Поточний акаунт: demo@egastro.ua')).toBeInTheDocument()
  })

  it('lets the user sign out to use another account', async () => {
    signIn({ id: 1, email: 'demo@egastro.ua', role: 'USER' })
    const { user } = renderGuestOnly()
    await user.click(await screen.findByRole('button', { name: 'Увійти іншим акаунтом' }))
    expect(await screen.findByText('Форма входу')).toBeInTheDocument()
  })
})
