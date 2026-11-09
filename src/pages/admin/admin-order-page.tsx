import { ArrowLeftIcon } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { AdminOrderView } from '@/features/admin'
import { Button } from '@/components/ui/button'
import { parseId } from '@/lib/parse-id'

export function AdminOrderPage() {
  const { orderId } = useParams()
  return (
    <>
      <title>{`Замовлення №${orderId ?? ''} · Адмін-панель`}</title>
      <div>
        <Button variant="ghost" asChild className="-ml-2">
          <Link to="/admin/orders">
            <ArrowLeftIcon />
            Усі замовлення
          </Link>
        </Button>
      </div>
      <AdminOrderView orderId={parseId(orderId)} />
    </>
  )
}
