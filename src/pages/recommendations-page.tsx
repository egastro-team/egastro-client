import { RecommendationsView } from '@/features/cart'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeading } from '@/components/layout/page-heading'

export function RecommendationsPage() {
  return (
    <PageContainer>
      <PageHeading title="Рекомендації для вас" />
      <RecommendationsView />
    </PageContainer>
  )
}
