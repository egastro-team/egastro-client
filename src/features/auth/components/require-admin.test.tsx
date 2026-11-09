import { screen } from '@testing-library/react'

import { renderWithProviders, signIn } from '@/test/render'

import { RequireAdmin } from './require-admin'

function renderAdminRoute() {
  return renderWithProviders(<RequireAdmin />, {
    route: '/admin',
    path: '/admin',
    routes: [{ path: '/login', element: <p>Сторінка входу</p> }],
  })
}

describe('RequireAdmin', () => {
  it('sends guests to login', async () => {
    renderAdminRoute()
    expect(await screen.findByText('Сторінка входу')).toBeInTheDocument()
  })

  it('shows "access denied" to a regular user', async () => {
    signIn({ id: 1, email: 'user@example.com', role: 'USER' })
    renderAdminRoute()
    expect(await screen.findByRole('heading', { name: 'Доступ заборонено' })).toBeInTheDocument()
  })

  it('lets an admin through', async () => {
    signIn({ id: 2, email: 'admin@egastro.local', role: 'ADMIN' })
    renderAdminRoute()
    expect(screen.queryByRole('heading', { name: 'Доступ заборонено' })).not.toBeInTheDocument()
    expect(screen.queryByText('Сторінка входу')).not.toBeInTheDocument()
  })
})
