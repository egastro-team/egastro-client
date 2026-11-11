import { ArrowRightIcon, SparklesIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

/** "Акційний банер" slot from the catalog wireframe — promotes the smart-cart feature. */
export function PromoBanner() {
  return (
    <section
      aria-label="Розумний кошик"
      className="relative overflow-hidden rounded-2xl bg-primary px-6 py-8 text-primary-foreground sm:px-10 sm:py-10"
    >
      <SparklesIcon
        className="pointer-events-none absolute -top-6 -right-6 size-40 opacity-15 sm:size-56"
        aria-hidden
      />
      <div className="relative flex max-w-xl flex-col items-start gap-3">
        <p className="text-sm font-semibold tracking-wide uppercase opacity-90">Розумний кошик</p>
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Додайте товари — ми підкажемо, що до них пасує
        </h2>
        <p className="opacity-90">
          Рекомендації будуються на основі того, що інші покупці часто купують разом.
        </p>
        <Button
          asChild
          variant="secondary"
          size="lg"
          className="mt-1 h-10 bg-card text-foreground hover:bg-card/90"
        >
          <Link to="/recommendations">
            Мої рекомендації
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </section>
  )
}
