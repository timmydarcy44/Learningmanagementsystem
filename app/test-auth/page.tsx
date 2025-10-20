'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

export default function TestAuthPage() {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = supabaseBrowser();
  const { addToast } = useToast();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      addToast({ 
        type: 'success', 
        message: `Utilisateur créé ! Vérifiez votre email: ${email}` 
      });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setUser(data.user);
      addToast({ type: 'success', message: 'Connexion réussie !' });
    } catch (err: any) {
      console.error('Sign in error:', err);
      addToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      addToast({ type: 'success', message: 'Déconnexion réussie !' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message });
    }
  };

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      addToast({ 
        type: 'info', 
        message: user ? `Utilisateur connecté: ${user.email}` : 'Aucun utilisateur connecté' 
      });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#252525] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="glass p-8 rounded-2xl">
          <h1 className="text-2xl font-semibold text-white mb-6 text-center">
            Test d'authentification
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-800/50 border border-white/10 text-white placeholder-neutral-500 focus:ring-2 focus:ring-iris-500 focus:border-transparent outline-none transition-all duration-300"
                placeholder="admin@test.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-800/50 border border-white/10 text-white placeholder-neutral-500 focus:ring-2 focus:ring-iris-500 focus:border-transparent outline-none transition-all duration-300"
                placeholder="password123"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="bg-iris-500 hover:bg-iris-400 text-white py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création...' : 'Créer compte'}
              </button>

              <button
                onClick={handleSignIn}
                disabled={loading}
                className="bg-blush-500 hover:bg-blush-400 text-white py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={checkUser}
                className="bg-lime-500 hover:bg-lime-400 text-white py-3 rounded-xl font-medium transition-all duration-300"
              >
                Vérifier utilisateur
              </button>

              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-400 text-white py-3 rounded-xl font-medium transition-all duration-300"
              >
                Déconnexion
              </button>
            </div>

            {user && (
              <div className="mt-6 p-4 bg-green-500/20 rounded-xl">
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
            )}

            <div className="mt-6 text-center">
              <a 
                href="/login" 
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                ← Retour à la connexion
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
