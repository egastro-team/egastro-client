import { SparklesIcon } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import type { RecommendedProduct } from '../schemas'

type RecommendationReasonProps = {
  recommendation: RecommendedProduct
}

const percent = new Intl.NumberFormat('uk-UA', { style: 'percent', maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 })
const smallPercent = new Intl.NumberFormat('uk-UA', { style: 'percent', maximumFractionDigits: 2 })

/**
 * Explains a model recommendation using association-rule metrics.
 * `score` is confidence in [0, 1] (CONTRACT.md §12), not lift. Fallback items have no metrics.
 */
export function RecommendationReason({ recommendation }: RecommendationReasonProps) {
  const { metrics, score } = recommendation
  const confidence = metrics?.confidence ?? score
  if (confidence === undefined) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded text-xs text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <SparklesIcon className="size-3" aria-hidden />
          {percent.format(confidence)} беруть разом
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-64">
        <p>{percent.format(confidence)} покупців із такими товарами в кошику купують і цей.</p>
        {(metrics?.lift !== undefined || metrics?.support !== undefined) && (
          <p className="mt-1 opacity-80">
            {metrics.lift !== undefined && <>Lift: {decimal.format(metrics.lift)}</>}
            {metrics.lift !== undefined && metrics.support !== undefined && ' · '}
            {metrics.support !== undefined && <>Support: {smallPercent.format(metrics.support)}</>}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
