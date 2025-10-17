import React from 'react'
import { cn } from '@/lib/utils'

export interface SidebarProps {
  children: React.ReactNode
  className?: string
}

export interface SidebarGroupProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export interface SidebarItemProps {
  icon?: string
  active?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 bg-white border-r hairline',
          className
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6 border-b hairline">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-xl bg-iris-grad flex items-center justify-center">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <span className="text-lg font-display font-semibold text-neutral-975">
                LMS
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-6">
            {children}
          </div>
        </div>
      </aside>
    )
  }
)
Sidebar.displayName = 'Sidebar'

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ title, children, className }, ref) => {
    return (
      <div ref={ref} className={cn('px-6', className)}>
        {title && (
          <h3 className="mb-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            {title}
          </h3>
        )}
        <div className="space-y-1">
          {children}
        </div>
      </div>
    )
  }
)
SidebarGroup.displayName = 'SidebarGroup'

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ icon, active, children, onClick, className }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          'w-full flex items-center space-x-3 px-3 py-2 text-left rounded-xl transition-colors',
          {
            'bg-iris-grad text-white': active,
            'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900': !active,
          },
          className
        )}
      >
        {icon && (
          <span className="text-lg flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="font-medium">{children}</span>
      </button>
    )
  }
)
SidebarItem.displayName = 'SidebarItem'

export { Sidebar, SidebarGroup, SidebarItem }