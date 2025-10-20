'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function ForgotPassword() {
  // Vérifier les variables d'environnement côté client
  if (typeof window !== 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center px-6">
        <div className="glass p-6 w-full max-w-md rounded-2xl">
          <h1 className="text-2xl font-semibold text-red-400">Configuration manquante</h1>
          <p className="mt-2 text-sm text-neutral-300">
            Les variables d'environnement Supabase ne sont pas configurées.
          </p>
        </div>
      </div>
    );
  }

  const sb = supabaseBrowser();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  
  const send = async () => {
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setMsg(error ? error.message : 'Email envoyé ✅');
  };
  
  return (
    <div className="min-h-[100svh] flex items-center justify-center px-6">
      <div className="glass p-6 w-full max-w-md rounded-2xl">
        <h1 className="text-2xl font-semibold">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-neutral-300">
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>
        <input 
          className="w-full h-11 bg-white/5 rounded-2xl px-3 mt-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-iris-500" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="email" 
          type="email"
        />
        <button 
          onClick={send} 
          className="w-full h-11 rounded-2xl bg-iris-grad text-white mt-3 hover:opacity-90"
        >
          Envoyer le lien
        </button>
        {msg && <p className="mt-2 text-sm text-neutral-300">{msg}</p>}
        <div className="mt-4 text-center">
          <a href="/login" className="text-sm text-iris-400 hover:underline">
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
}
