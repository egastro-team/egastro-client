import { createBrowserRouter } from 'react-router'

import { RootLayout } from '@/app/root-layout'
import { RouteError } from '@/app/route-error'
import { GuestOnly, RequireAdmin, RequireAuth } from '@/features/auth'
import { RouteFallback } from '@/components/layout/route-fallback'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RouteError,
    HydrateFallback: RouteFallback,
    children: [
      // Public
      {
        index: true,
        lazy: async () => ({ Component: (await import('@/pages/catalog-page')).CatalogPage }),
      },
      {
        path: 'products/:productId',
        lazy: async () => ({ Component: (await import('@/pages/product-page')).ProductPage }),
      },

      // Guests only
      {
        Component: GuestOnly,
        children: [
          {
            path: 'login',
            lazy: async () => ({ Component: (await import('@/pages/login-page')).LoginPage }),
          },
          {
            path: 'register',
            lazy: async () => ({ Component: (await import('@/pages/register-page')).RegisterPage }),
          },
        ],
      },

      // Signed-in customers (and admins)
      {
        Component: RequireAuth,
        children: [
          {
            path: 'cart',
            lazy: async () => ({ Component: (await import('@/pages/cart-page')).CartPage }),
          },
          {
            path: 'checkout',
            lazy: async () => ({ Component: (await import('@/pages/checkout-page')).CheckoutPage }),
          },
          {
            path: 'recommendations',
            lazy: async () => ({
              Component: (await import('@/pages/recommendations-page')).RecommendationsPage,
            }),
          },
          {
            path: 'orders',
            lazy: async () => ({ Component: (await import('@/pages/orders-page')).OrdersPage }),
          },
          {
            path: 'orders/:orderId',
            lazy: async () => ({ Component: (await import('@/pages/order-page')).OrderPage }),
          },
        ],
      },

      // Admin
      {
        path: 'admin',
        Component: RequireAdmin,
        children: [
          {
            lazy: async () => ({
              Component: (await import('@/pages/admin/admin-layout')).AdminLayout,
            }),
            children: [
              {
                index: true,
                lazy: async () => ({
                  Component: (await import('@/pages/admin/admin-overview-page')).AdminOverviewPage,
                }),
              },
              {
                path: 'orders',
                lazy: async () => ({
                  Component: (await import('@/pages/admin/admin-orders-page')).AdminOrdersPage,
                }),
              },
              {
                path: 'orders/:orderId',
                lazy: async () => ({
                  Component: (await import('@/pages/admin/admin-order-page')).AdminOrderPage,
                }),
              },
              {
                path: 'products',
                lazy: async () => ({
                  Component: (await import('@/pages/admin/admin-products-page')).AdminProductsPage,
                }),
              },
              {
                path: 'products/new',
                lazy: async () => ({
                  Component: (await import('@/pages/admin/admin-product-new-page'))
                    .AdminProductNewPage,
                }),
              },
              {
                path: 'products/:productId/edit',
                lazy: async () => ({
                  Component: (await import('@/pages/admin/admin-product-edit-page'))
                    .AdminProductEditPage,
                }),
              },
              {
                path: 'categories',
                lazy: async () => ({
                  Component: (await import('@/pages/admin/admin-categories-page'))
                    .AdminCategoriesPage,
                }),
              },
            ],
          },
        ],
      },

      {
        path: '*',
        lazy: async () => ({ Component: (await import('@/pages/not-found-page')).NotFoundPage }),
      },
    ],
  },
])
