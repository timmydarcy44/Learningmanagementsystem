'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function LoginApprenantPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Vérifier si déjà connecté au chargement
  useEffect(() => {
    const checkSession = async () => {
      const sb = supabaseBrowser();
      const { data: { session } } = await sb.auth.getSession();
      
      if (session?.user) {
        console.log('🔍 LoginApprenant: User already authenticated, checking role...');
        try {
          const res = await fetch('/api/role', { cache: 'no-store' });
          const json = await res.json();
          
          if (json.role) {
            console.log(`🔍 LoginApprenant: Redirecting to ${json.role} dashboard`);
            const redirectUrl = json.role === 'admin' ? '/admin' :
                               json.role === 'instructor' ? '/formateur' :
                               json.role === 'tutor' ? '/tuteur' : '/apprenant';
            router.replace(redirectUrl);
          }
        } catch (error) {
          console.error('🔍 LoginApprenant: Error checking role:', error);
        }
      }
    };

    checkSession();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const sb = supabaseBrowser();
      const { data: { user }, error } = await sb.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error || !user) {
        setErr('Identifiants invalides');
        setLoading(false);
        toast.error('Identifiants invalides');
        return;
      }

      console.log(`🔍 LoginApprenant: User ${user.email} authenticated, checking role...`);

      // Vérifier le rôle côté serveur
      const res = await fetch('/api/role', { cache: 'no-store' });
      const json = await res.json();

      if (!json.role) {
        setErr('Aucun rôle associé à ce compte.');
        setLoading(false);
        toast.error('Aucun rôle associé à ce compte');
        return;
      }

      console.log(`🔍 LoginApprenant: User has role ${json.role}, redirecting...`);

      // Redirection selon le rôle
      const redirectUrl = json.role === 'admin' ? '/admin' :
                         json.role === 'instructor' ? '/formateur' :
                         json.role === 'tutor' ? '/tuteur' : '/apprenant';

      toast.success(`Connexion réussie ! Redirection vers ${json.role}...`);
      router.replace(redirectUrl);

    } catch (error) {
      console.error('🔍 LoginApprenant: Login error:', error);
      setErr('Erreur de connexion');
      setLoading(false);
      toast.error('Erreur de connexion');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="max-w-sm mx-auto glass p-8 rounded-2xl space-y-6 w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-orange-400 mb-2">Apprenant</h1>
          <p className="text-white/70">Connexion à l'espace apprenant</p>
        </div>
        
        <div className="space-y-4">
          <input 
            className="bg-white/5 border border-white/10 rounded-xl h-12 w-full px-4 text-white placeholder-white/50 focus:border-orange-400 focus:outline-none transition-colors" 
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            className="bg-white/5 border border-white/10 rounded-xl h-12 w-full px-4 text-white placeholder-white/50 focus:border-orange-400 focus:outline-none transition-colors" 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {err && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
            {err}
          </div>
        )}

        <button 
          disabled={loading} 
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>

        <div className="text-center">
          <p className="text-white/50 text-sm">
            Pas encore de compte ?{' '}
            <a href="/create-password" className="text-orange-400 hover:text-orange-300 transition-colors">
              Créer un mot de passe
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}