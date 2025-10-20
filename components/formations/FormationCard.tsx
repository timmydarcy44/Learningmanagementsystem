'use client';

import React from 'react';
import Link from 'next/link';
import { Formation } from '@/types/db';
import VisibilityBadge from './VisibilityBadge';
import { Card } from '@/components/ui/Card';

interface FormationCardProps {
  formation: Formation;
}

const FormationCard: React.FC<FormationCardProps> = ({ formation }) => {
  return (
    <Link href={`/app/formations/${formation.id}`}>
      <Card variant="interactive" className="group h-full">
        <div className="space-y-4">
          {/* Cover Image */}
          <div className="aspect-video rounded-xl overflow-hidden bg-dark-elevated">
            {formation.cover_url ? (
              <img
                src={formation.cover_url}
                alt={formation.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">📚</div>
                  <div className="text-sm">Pas de couverture</div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-neutral-100 group-hover:text-white transition-colors line-clamp-2">
                {formation.title}
              </h3>
              <VisibilityBadge mode={formation.visibility_mode} />
            </div>

            {formation.description && (
              <p className="text-sm text-neutral-400 line-clamp-3">
                {formation.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  formation.published ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <span className="text-xs text-neutral-400">
                  {formation.published ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              
              <div className="text-xs text-neutral-500">
                {new Date(formation.updated_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default FormationCard;
