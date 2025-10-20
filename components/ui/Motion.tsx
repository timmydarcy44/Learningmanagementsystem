'use client';
import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export const MotionWrapper = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ className, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
MotionWrapper.displayName = 'MotionWrapper';

// exports utiles si besoin
export const MotionDiv = motion.div;
export const MotionSpan = motion.span;