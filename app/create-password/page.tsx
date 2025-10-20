'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function CreatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const sb = supabaseBrowser();
      const { error } = await sb.auth.updateUser({ password });
      
      if (error) {
        setMessage(`Erreur: ${error.message}`);
      } else {
        setMessage('Mot de passe créé avec succès ! Redirection...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-iris-grad mb-2">Créer votre mot de passe</h1>
          <p className="text-white/70">Définissez un mot de passe sécurisé pour votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-xl bg-white/5 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 rounded-xl bg-white/5 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50"
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cta-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer le mot de passe'}
          </button>

          {message && (
            <div className={`text-center text-sm ${
              message.includes('succès') ? 'text-green-400' : 'text-red-400'
            }`}>
              {message}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-white/50">
            En créant votre mot de passe, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  );
}