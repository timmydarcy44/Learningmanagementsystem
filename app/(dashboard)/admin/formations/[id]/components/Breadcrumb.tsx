'use client';

import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  formationTitle: string;
  chapterTitle?: string;
  subchapterTitle?: string;
}

export default function Breadcrumb({ formationTitle, chapterTitle, subchapterTitle }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      <span className="text-white/70">{formationTitle}</span>
      
      {chapterTitle && (
        <>
          <ChevronRight size={16} className="text-white/40" />
          <span className="text-white/90 font-medium">{chapterTitle}</span>
        </>
      )}
      
      {subchapterTitle && (
        <>
          <ChevronRight size={16} className="text-white/40" />
          <span className="text-white font-semibold">{subchapterTitle}</span>
        </>
      )}
    </nav>
  );
}