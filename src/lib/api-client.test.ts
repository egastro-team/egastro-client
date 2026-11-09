import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'
import { apiError } from '@/test/api-error'
import { signIn } from '@/test/render'

describe('apiClient', () => {
  it('sends the bearer token', async () => {
    signIn()
    let authorization: unknown
    await apiClient.get('/cart', {
      adapter: async (config) => {
        authorization = config.headers.get('Authorization')
        return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
      },
    })
    expect(authorization).toBe('Bearer test-token')
  })

  it('ends the session on a 401 from a protected endpoint', async () => {
    signIn()
    await expect(
      apiClient.get('/cart', {
        adapter: async () =>
          Promise.reject(apiError(401, 'Authentication required', undefined, '/cart')),
      }),
    ).rejects.toThrow('Request failed')
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('keeps the session on a failed login attempt', async () => {
    signIn()
    await expect(
      apiClient.post(
        '/auth/login',
        {},
        {
          adapter: async () =>
            Promise.reject(apiError(401, 'Incorrect email or password', undefined, '/auth/login')),
        },
      ),
    ).rejects.toThrow('Request failed')
    expect(useAuthStore.getState().accessToken).toBe('test-token')
  })

  it('drops an expired token instead of sending it', async () => {
    useAuthStore.getState().setSession({
      accessToken: 'old',
      expiresIn: -1,
      user: { id: 1, email: 'a@b.c', role: 'USER' },
    })
    let authorization: unknown = 'unset'
    await apiClient.get('/products', {
      adapter: async (config) => {
        authorization = config.headers.get('Authorization')
        return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
      },
    })
    expect(authorization).toBeUndefined()
    expect(useAuthStore.getState().accessToken).toBeNull()
  })
})
