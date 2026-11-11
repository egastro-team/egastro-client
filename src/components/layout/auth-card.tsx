import type { ReactNode } from 'react'

import authPhoto from '@/assets/auth-groceries.jpg'

import { BrandName } from './brand-name'

type AuthCardProps = {
  title: string
  description?: string
  children: ReactNode
}

/** Split auth card from the Figma mockups: groceries photo on the left, form on the right. */
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:py-12">
      <title>{`${title} · єГастро`}</title>
      <section className="grid w-full max-w-sm overflow-hidden rounded-2xl bg-card text-card-foreground shadow-sm sm:max-w-2xl sm:grid-cols-[2fr_3fr]">
        <img src={authPhoto} alt="" className="hidden size-full min-h-full object-cover sm:block" />
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-3">
            <BrandName className="text-lg" />
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-2xl font-bold tracking-tight">{title}</h1>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
          {children}
        </div>
      </section>
    </div>
  )
}
