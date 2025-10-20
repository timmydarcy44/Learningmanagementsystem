import { PageHeader } from '@/components/admin/PageHeader';
import { GridCard } from '@/components/admin/GridCard';
import { EmptyState } from '@/components/admin/EmptyState';
import { Plus, Search, FileText } from 'lucide-react';

export default function RessourcesPage() {
  // Mock data pour l'instant
  const ressources = [
    {
      id: '1',
      title: 'Guide de développement React',
      description: 'Guide complet pour développer des applications React modernes',
      cover_url: null,
      type: 'pdf',
      price: 29.99,
    },
    {
      id: '2',
      title: 'Vidéo : Introduction à TypeScript',
      description: 'Formation vidéo de 2h sur les bases de TypeScript',
      cover_url: null,
      type: 'video',
      price: 49.99,
    },
    {
      id: '3',
      title: 'Template de présentation',
      description: 'Modèle PowerPoint professionnel pour vos présentations',
      cover_url: null,
      type: 'image',
      price: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ressources"
        subtitle="Gérez vos ressources pédagogiques"
        actions={
          <a
            href="/admin/ressources/new"
            className="flex items-center gap-2 px-4 py-2 bg-iris-500 hover:bg-iris-400 text-white font-medium rounded-xl transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouvelle ressource
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
              placeholder="Rechercher une ressource..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
            />
          </div>
        </div>
        
        <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-iris-500/50">
          <option value="">Tous les types</option>
          <option value="pdf">PDF</option>
          <option value="video">Vidéo</option>
          <option value="image">Image</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      {/* Grid des ressources */}
      {ressources.length === 0 ? (
        <EmptyState
          icon="file-text"
          title="Aucune ressource"
          description="Commencez par ajouter votre première ressource pédagogique."
          action={{
            label: "Ajouter une ressource",
            href: "/admin/ressources/new"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ressources.map((ressource) => (
            <GridCard
              key={ressource.id}
              title={ressource.title}
              description={ressource.description}
              image={ressource.cover_url || undefined}
              badges={[
                {
                  label: ressource.type.toUpperCase(),
                  variant: 'default'
                },
                {
                  label: ressource.price === 0 ? 'Gratuit' : `${ressource.price}€`,
                  variant: ressource.price === 0 ? 'success' : 'warning'
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
