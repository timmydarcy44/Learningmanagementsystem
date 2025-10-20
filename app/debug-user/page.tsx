import { supabaseServer } from '@/lib/supabase/server';

export default async function DebugUserPage() {
  // Vérifier les variables d'environnement
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="glass p-6">
        <h1 className="text-2xl font-semibold text-red-400">Variables d'environnement manquantes</h1>
        <p className="text-neutral-400">NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont requis</p>
      </div>
    );
  }

  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  
  if (!user) {
    return <div className="glass p-6">Non connecté</div>;
  }

  const { data: profile } = await sb
    .from('profiles')
    .select('has_password')
    .eq('id', user.id)
    .maybeSingle();

  const { data: membership } = await sb
    .from('org_memberships')
    .select('org_id, role')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <div className="glass p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Debug Utilisateur</h1>
      
      <div>
        <h2 className="text-lg font-medium">Utilisateur</h2>
        <pre className="bg-neutral-800 p-3 rounded text-sm">
          {JSON.stringify({ id: user.id, email: user.email }, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-medium">Profile</h2>
        <pre className="bg-neutral-800 p-3 rounded text-sm">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-medium">Membership</h2>
        <pre className="bg-neutral-800 p-3 rounded text-sm">
          {JSON.stringify(membership, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-medium">Redirection attendue</h2>
        <div className="bg-neutral-800 p-3 rounded text-sm">
          {!profile?.has_password ? (
            <span className="text-yellow-400">→ /create-password</span>
          ) : !membership ? (
            <span className="text-red-400">→ /login (pas de membership)</span>
          ) : membership.role === 'admin' || membership.role === 'instructor' ? (
            <span className="text-green-400">→ /app/formations</span>
          ) : membership.role === 'learner' ? (
            <span className="text-blue-400">→ /app/learning</span>
          ) : membership.role === 'tutor' ? (
            <span className="text-purple-400">→ /app/tutor</span>
          ) : (
            <span className="text-red-400">→ /login (rôle inconnu)</span>
          )}
        </div>
      </div>
    </div>
  );
}
