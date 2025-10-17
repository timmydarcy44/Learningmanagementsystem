import { supabaseServer } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const sb = supabaseServer();
  // Lit 8 formations visibles (peu importe le mode, côté formateur/admin on voit tout)
  const { data: formations, error } = await sb
    .from('formations')
    .select('id,title,visibility_mode,published,created_at')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    return <div className="p-6 border border-white/10 rounded-2xl">Erreur: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Tableau de bord</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(formations ?? []).map((f) => (
          <div key={f.id} className="glass p-5">
            <div className="text-sm text-neutral-400">{f.visibility_mode}</div>
            <div className="mt-1 text-lg font-medium">{f.title}</div>
            <div className="mt-3 text-xs text-neutral-400">
              {f.published ? 'Publié' : 'Brouillon'}
            </div>
          </div>
        ))}
        {(!formations || formations.length === 0) && (
          <div className="glass p-6">Aucune formation pour le moment.</div>
        )}
      </div>
    </div>
  );
}
