'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface StatProps {
  value: string | number
  label: string
  change?: {
    value: string
    type: 'positive' | 'negative' | 'neutral'
  }
  icon?: React.ReactNode
  className?: string
}

const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({ value, label, change, icon, className }, ref) => {
    const changeColors = {
      positive: 'text-lime-400 bg-lime-400/10',
      negative: 'text-red-400 bg-red-400/10',
      neutral: 'text-neutral-400 bg-neutral-400/10',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'glass p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-elev-3',
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-iris-grad flex items-center justify-center text-white">
              {icon}
            </div>
          )}
          
          {change && (
            <div className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              changeColors[change.type]
            )}>
              {change.value}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-3xl md:text-4xl font-display font-bold text-neutral-100">
            {value}
          </div>
          <div className="text-sm text-neutral-400 font-medium">
            {label}
          </div>
        </div>
      </div>
    )
  }
)

Stat.displayName = 'Stat'

export { Stat }