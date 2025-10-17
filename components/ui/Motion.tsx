'use client'

import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface MotionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  delay?: number
  duration?: number
  variant?: 'fade' | 'slide' | 'scale' | 'blur'
}

const Motion = React.forwardRef<HTMLDivElement, MotionProps>(
  ({ children, className, delay = 0, duration = 0.8, variant = 'fade', ...props }, ref) => {
    const variants = {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      slide: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
      },
      scale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      },
      blur: {
        initial: { opacity: 0, filter: 'blur(10px)' },
        animate: { opacity: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, filter: 'blur(10px)' },
      },
    }

    return (
      <motion.div
        ref={ref}
        initial={variants[variant].initial}
        animate={variants[variant].animate}
        exit={variants[variant].exit}
        transition={{
          duration,
          delay,
          ease: 'easeOut',
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
Motion.displayName = 'Motion'

// Staggered motion for lists
export interface MotionStaggerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  stagger?: number
  delay?: number
}

const MotionStagger = React.forwardRef<HTMLDivElement, MotionStaggerProps>(
  ({ children, className, stagger = 0.1, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          delay,
          staggerChildren: stagger,
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
MotionStagger.displayName = 'MotionStagger'

// Individual item for stagger
export interface MotionItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
}

const MotionItem = React.forwardRef<HTMLDivElement, MotionItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
MotionItem.displayName = 'MotionItem'

export { Motion, MotionStagger, MotionItem }