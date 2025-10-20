'use client';

import { BookOpen, Users, FileText, GraduationCap, ClipboardList, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: string; // Nom de l'icône au lieu du composant
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

// Mapping des noms d'icônes vers les composants
const iconMap: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'users': Users,
  'file-text': FileText,
  'graduation-cap': GraduationCap,
  'clipboard-list': ClipboardList,
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const IconComponent = iconMap[icon] || BookOpen; // Fallback vers BookOpen

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="p-4 bg-white/5 rounded-2xl mb-6">
        <IconComponent className="h-12 w-12 text-white/30" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70 mb-8 max-w-md">{description}</p>
      
      {action && (
        <a
          href={action.href}
          className="btn-cta-lg"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}