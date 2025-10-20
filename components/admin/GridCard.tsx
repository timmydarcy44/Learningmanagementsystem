'use client';

import { ReactNode } from 'react';

interface Badge {
  label: string;
  variant: 'default' | 'success' | 'warning' | 'error';
}

interface GridCardProps {
  title: string;
  description?: string;
  image?: string;
  badges?: Badge[];
  actions?: ReactNode;
  onClick?: () => void;
}

export function GridCard({ title, description, image, badges, actions, onClick }: GridCardProps) {
  return (
    <div 
      className="glass p-6 rounded-2xl hover:shadow-elev-3 transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      {image && (
        <div className="aspect-video mb-4 rounded-xl overflow-hidden bg-white/5">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-iris-300 transition-colors">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-white/70 line-clamp-2">
            {description}
          </p>
        )}

        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-lg font-medium ${
                  badge.variant === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                  badge.variant === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  badge.variant === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-white/10 text-white/70'
                }`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="pt-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}