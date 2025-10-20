import { supabaseServer } from '@/lib/supabase/server';

export default async function TestServerAuthPage() {
  const supabase = await supabaseServer();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    return (
      <div className="min-h-screen bg-[#252525] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="glass p-8 rounded-2xl">
            <h1 className="text-2xl font-semibold text-white mb-6 text-center">
              Test Auth Serveur
            </h1>
            
            {error ? (
              <div className="p-4 bg-red-500/20 rounded-xl">
                <h3 className="text-red-400 font-medium mb-2">Erreur :</h3>
                <p className="text-sm text-neutral-300">{error.message}</p>
              </div>
            ) : user ? (
              <div className="p-4 bg-green-500/20 rounded-xl">
                <h3 className="text-green-400 font-medium mb-2">Utilisateur connecté :</h3>
                <p className="text-sm text-neutral-300">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-sm text-neutral-300">
                  <strong>ID:</strong> {user.id}
                </p>
                <p className="text-sm text-neutral-300">
                  <strong>Confirmé:</strong> {user.email_confirmed_at ? 'Oui' : 'Non'}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-yellow-500/20 rounded-xl">
                <h3 className="text-yellow-400 font-medium mb-2">Aucun utilisateur connecté</h3>
                <p className="text-sm text-neutral-300">
                  Vous devez vous connecter pour voir vos informations.
                </p>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <a 
                href="/test-auth" 
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                ← Test côté client
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="min-h-screen bg-[#252525] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="glass p-8 rounded-2xl">
            <h1 className="text-2xl font-semibold text-white mb-6 text-center">
              Erreur Serveur
            </h1>
            
            <div className="p-4 bg-red-500/20 rounded-xl">
              <h3 className="text-red-400 font-medium mb-2">Erreur :</h3>
              <p className="text-sm text-neutral-300">{err.message}</p>
            </div>
            
            <div className="mt-6 text-center">
              <a 
                href="/test-auth" 
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                ← Test côté client
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
