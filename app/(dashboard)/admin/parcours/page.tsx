import { PageHeader } from '@/components/admin/PageHeader';
import { GridCard } from '@/components/admin/GridCard';
import { EmptyState } from '@/components/admin/EmptyState';
import { Plus, Search, GraduationCap } from 'lucide-react';

export default function ParcoursPage() {
  // Mock data pour l'instant
  const parcours = [
    {
      id: '1',
      title: 'Parcours Développeur Frontend',
      description: 'Formation complète pour devenir développeur frontend',
      cover_url: null,
      items_count: 8,
      duration: '40h',
    },
    {
      id: '2',
      title: 'Parcours Data Science',
      description: 'Apprentissage des bases de la science des données',
      cover_url: null,
      items_count: 12,
      duration: '60h',
    },
    {
      id: '3',
      title: 'Parcours UX/UI Design',
      description: 'Design d\'interface et expérience utilisateur',
      cover_url: null,
      items_count: 6,
      duration: '30h',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parcours"
        subtitle="Créez des parcours d'apprentissage structurés"
        actions={
          <a
            href="/admin/parcours/new"
            className="flex items-center gap-2 px-4 py-2 bg-iris-500 hover:bg-iris-400 text-white font-medium rounded-xl transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouveau parcours
          </a>
        }
      />

      {/* Barre d'actions */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Rechercher un parcours..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
            />
          </div>
        </div>
        
        <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-iris-500/50">
          <option value="">Tous les parcours</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      {/* Grid des parcours */}
      {parcours.length === 0 ? (
        <EmptyState
          icon="graduation-cap"
          title="Aucun parcours"
          description="Créez votre premier parcours d'apprentissage structuré."
          action={{
            label: "Créer un parcours",
            href: "/admin/parcours/new"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parcours.map((parcours) => (
            <GridCard
              key={parcours.id}
              title={parcours.title}
              description={parcours.description}
              image={parcours.cover_url || undefined}
              badges={[
                {
                  label: `${parcours.items_count} éléments`,
                  variant: 'default'
                },
                {
                  label: parcours.duration,
                  variant: 'success'
                }
              ]}
              actions={
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-iris-500/20 text-iris-400 text-sm rounded-lg hover:bg-iris-500/30 transition-colors">
                    Éditer
                  </button>
                  <button className="px-3 py-1 bg-white/10 text-white/70 text-sm rounded-lg hover:bg-white/20 transition-colors">
                    Aperçu
                  </button>
                  <button className="p-1 text-white/50 hover:text-white/70 transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
