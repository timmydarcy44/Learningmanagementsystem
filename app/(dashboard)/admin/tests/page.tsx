import { PageHeader } from '@/components/admin/PageHeader';
import { GridCard } from '@/components/admin/GridCard';
import { EmptyState } from '@/components/admin/EmptyState';
import { Plus, Search, ClipboardList } from 'lucide-react';

export default function TestsPage() {
  // Mock data pour l'instant
  const tests = [
    {
      id: '1',
      title: 'Quiz JavaScript',
      description: 'Test de connaissances sur les bases de JavaScript',
      cover_url: null,
      type: 'typeform',
      embed_url: 'https://form.typeform.com/to/abc123',
    },
    {
      id: '2',
      title: 'Évaluation React',
      description: 'Test pratique sur React et ses concepts avancés',
      cover_url: null,
      type: 'typeform',
      embed_url: 'https://form.typeform.com/to/def456',
    },
    {
      id: '3',
      title: 'QCM TypeScript',
      description: 'Questions à choix multiples sur TypeScript',
      cover_url: null,
      type: 'typeform',
      embed_url: 'https://form.typeform.com/to/ghi789',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tests"
        subtitle="Gérez vos évaluations et quiz"
        actions={
          <a
            href="/admin/tests/new"
            className="flex items-center gap-2 px-4 py-2 bg-iris-500 hover:bg-iris-400 text-white font-medium rounded-xl transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouveau test
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
              placeholder="Rechercher un test..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
            />
          </div>
        </div>
        
        <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-iris-500/50">
          <option value="">Tous les types</option>
          <option value="typeform">Typeform</option>
          <option value="custom">Personnalisé</option>
        </select>
      </div>

      {/* Grid des tests */}
      {tests.length === 0 ? (
        <EmptyState
          icon="clipboard-list"
          title="Aucun test"
          description="Créez votre premier test d'évaluation pour vos apprenants."
          action={{
            label: "Créer un test",
            href: "/admin/tests/new"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <GridCard
              key={test.id}
              title={test.title}
              description={test.description}
              image={test.cover_url || undefined}
              badges={[
                {
                  label: 'Typeform',
                  variant: 'default'
                },
                {
                  label: 'Actif',
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
