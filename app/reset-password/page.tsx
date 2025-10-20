'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
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
  const router = useRouter();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  
  const save = async () => {
    if (p1.length < 8) return setMsg('Min. 8 caractères');
    if (p1 !== p2) return setMsg('Les mots de passe ne correspondent pas');
    
    const { error } = await sb.auth.updateUser({ password: p1 });
    setMsg(error ? error.message : 'Mot de passe mis à jour ✅');
    if (!error) setTimeout(() => router.replace('/'), 600);
  };
  
  return (
    <div className="min-h-[100svh] flex items-center justify-center px-6">
      <div className="glass p-6 w-full max-w-md rounded-2xl">
        <h1 className="text-2xl font-semibold">Nouveau mot de passe</h1>
        <p className="mt-2 text-sm text-neutral-300">
          Définissez votre nouveau mot de passe.
        </p>
        <input 
          className="w-full h-11 bg-white/5 rounded-2xl px-3 mt-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-iris-500" 
          type="password" 
          placeholder="Mot de passe" 
          value={p1} 
          onChange={e => setP1(e.target.value)} 
        />
        <input 
          className="w-full h-11 bg-white/5 rounded-2xl px-3 mt-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-iris-500" 
          type="password" 
          placeholder="Confirmer" 
          value={p2} 
          onChange={e => setP2(e.target.value)} 
        />
        <button 
          onClick={save} 
          className="w-full h-11 rounded-2xl bg-iris-grad text-white mt-3 hover:opacity-90"
        >
          Enregistrer
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
