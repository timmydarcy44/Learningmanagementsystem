'use client';

import React from 'react';
import { VisibilityMode } from '@/types/db';
import { cn } from '@/lib/utils';

interface VisibilityBadgeProps {
  mode: VisibilityMode;
  className?: string;
}

const VisibilityBadge: React.FC<VisibilityBadgeProps> = ({ mode, className }) => {
  const config = {
    catalog_only: {
      label: 'Catalogue',
      className: 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30',
    },
    pathway_only: {
      label: 'Parcours',
      className: 'bg-iris-500/20 text-iris-300 border-iris-500/30',
    },
    both: {
      label: 'Les deux',
      className: 'bg-blush-500/20 text-blush-300 border-blush-500/30',
    },
  };

  const { label, className: badgeClassName } = config[mode];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border',
        badgeClassName,
        className
      )}
    >
      {label}
    </span>
  );
};

export default VisibilityBadge;
