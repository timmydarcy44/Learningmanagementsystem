export const dynamic = 'force-dynamic'; export const revalidate = 0;

import { supabaseServer } from '@/lib/supabase/server';
import { EmptyState } from '@/components/admin/EmptyState';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default async function FormationsPage() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  // NE PAS filtrer par org_id tant que le contexte d'org n'est pas fiable
  const { data, error } = await sb
    .from('formations')
    .select('id, title, cover_url, visibility_mode, published, updated_at, org_id')
    .order('updated_at', { ascending: false });

  if (error) {
    // Affiche l'erreur vraie pour debug
    return (
      <div className="space-y-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-iris-grad">Formations</h2>
        </div>
        <pre className="text-red-400 text-xs whitespace-pre-wrap bg-black/20 p-4 rounded">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="space-y-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-iris-grad">Formations</h2>
          <Link href="/admin/formations/new" className="btn-cta-lg">Créer une formation</Link>
        </div>
        <div className="opacity-70">Aucune formation trouvée.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-iris-grad">Formations</h2>
          <p className="text-sm opacity-70">Toutes mes formations (créées par moi et celles de mes organisations)</p>
        </div>
        <Link href="/admin/formations/new" className="btn-cta-lg">Créer une formation</Link>
      </div>

      {/* Barre d'actions */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
            />
          </div>
        </div>

        <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-iris-500/50">
          <option value="">Toutes les visibilités</option>
          <option value="public">Public</option>
          <option value="catalog_only">Catalogue uniquement</option>
          <option value="private">Privé</option>
        </select>

        <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-iris-500/50">
          <option value="">Tous les statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
        </select>
      </div>

      {/* Grid des formations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((formation) => (
          <Link key={formation.id} href={`/admin/formations/${formation.id}`} className="glass rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:shadow-elev-3 transition">
            <div className="aspect-video bg-gradient-to-br from-iris-500/20 to-blush-500/20 flex items-center justify-center">
              {formation.cover_url ? (
                <img 
                  src={formation.cover_url} 
                  alt={formation.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-white/50 text-sm">Image de couverture</div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  formation.published 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {formation.published ? 'Publié' : 'Brouillon'}
                </span>
                <span className="text-xs opacity-70">{formation.visibility_mode}</span>
              </div>
              <div className="text-xs opacity-50 mb-1">Org: {formation.org_id}</div>
              <h3 className="font-semibold text-white mb-1">{formation.title}</h3>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs opacity-50">
                  Modifié le {new Date(formation.updated_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-white/50 hover:text-white/70 transition-colors">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}