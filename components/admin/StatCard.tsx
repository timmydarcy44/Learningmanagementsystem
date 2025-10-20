'use client';

import { Users, GraduationCap, BookOpen, FileText, LucideIcon } from 'lucide-react';

interface Trend {
  value: number;
  isPositive: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string; // Nom de l'icône au lieu du composant
  trend?: Trend;
}

// Mapping des noms d'icônes vers les composants
const iconMap: Record<string, LucideIcon> = {
  'users': Users,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'file-text': FileText,
};

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  const IconComponent = iconMap[icon] || Users; // Fallback vers Users

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/70 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
          {trend && (
            <p className={`text-sm mt-1 ${
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </p>
          )}
        </div>
        <div className="p-3 bg-iris-500/20 rounded-xl">
          <IconComponent className="h-6 w-6 text-iris-400" />
        </div>
      </div>
    </div>
  );
}