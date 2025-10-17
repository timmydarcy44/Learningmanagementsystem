'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  centered?: boolean
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ eyebrow, title, description, action, className, centered = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'space-y-4',
          centered && 'text-center',
          className
        )}
      >
        {eyebrow && (
          <div className="text-sm font-medium text-iris-400 uppercase tracking-wider">
            {eyebrow}
          </div>
        )}
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-100 leading-tight">
          {title}
        </h2>
        
        {description && (
          <p className="text-lg text-neutral-400 leading-relaxed max-w-3xl text-balance">
            {description}
          </p>
        )}
        
        {action && (
          <div className="pt-2">
            {action}
          </div>
        )}
      </div>
    )
  }
)

SectionHeader.displayName = 'SectionHeader'

export { SectionHeader }