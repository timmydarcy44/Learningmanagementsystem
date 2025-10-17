'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function DebugLogin() {
  const sb = supabaseBrowser();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function send() {
    setMsg(null);
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'http://localhost:3000/app' }, // doit être dans Redirect URLs
    });
    setMsg(error ? `ERR: ${error.message}` : 'Lien envoyé ✅');
  }

  return (
    <div className="min-h-screen bg-[#252525] text-neutral-100 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Debug <span className="bg-gradient-to-r from-iris-500 to-cyan-400 bg-clip-text text-transparent">Login</span>
        </h1>
        
        <div className="glass p-6 rounded-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              className="w-full bg-white/5 rounded-2xl px-4 h-12 border border-white/10 focus:border-iris-500 focus:outline-none"
              placeholder="votre@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <button 
            onClick={send} 
            className="w-full rounded-2xl h-12 px-4 bg-gradient-to-r from-iris-500 to-cyan-400 text-white hover:opacity-90 transition-opacity font-medium"
          >
            Envoyer OTP
          </button>
          
          {msg && (
            <div className={`text-sm mt-4 p-3 rounded-xl ${
              msg.includes('ERR') ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'
            }`}>
              {msg}
            </div>
          )}
        </div>
        
        <div className="mt-8 glass p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">📋 Instructions</h2>
          <ol className="text-sm text-neutral-300 space-y-2">
            <li>1. Remplacez les valeurs dans <code className="bg-dark-elevated px-2 py-1 rounded">.env.local</code> par vos vraies clés Supabase</li>
            <li>2. Configurez les Redirect URLs dans Supabase Dashboard</li>
            <li>3. Testez l'envoi d'OTP avec votre email</li>
            <li>4. Vérifiez les erreurs dans DevTools → Network</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
