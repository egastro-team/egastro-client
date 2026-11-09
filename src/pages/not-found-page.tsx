import { Link } from 'react-router'

import { PageContainer } from '@/components/layout/page-container'
import { PageHeading } from '@/components/layout/page-heading'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <PageContainer className="max-w-3xl items-start py-16">
      <PageHeading title="Сторінку не знайдено" description="Помилка 404: такої адреси не існує." />
      <Button asChild>
        <Link to="/">На головну</Link>
      </Button>
    </PageContainer>
  )
}
