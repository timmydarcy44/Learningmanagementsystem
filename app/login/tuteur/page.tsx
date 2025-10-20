'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginTuteurPage() {
  const [email,setEmail] = useState(''); const [password,setPassword]=useState('');
  const [err,setErr] = useState<string|null>(null); const [loading,setLoading]=useState(false);
  const router = useRouter();
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setLoading(true);
    const sb = supabaseBrowser();
    const { data: { user }, error } = await sb.auth.signInWithPassword({ email, password });
    if (error || !user) { setErr('Identifiants invalides'); setLoading(false); return; }
    const res = await fetch('/api/role', { cache: 'no-store' });
    const json = await res.json();
    if (!json.role) { setErr('Aucun rôle associé.'); setLoading(false); return; }
    router.replace(json.role === 'admin' ? '/admin' :
                   json.role === 'instructor' ? '/formateur' :
                   json.role === 'tutor' ? '/tuteur' : '/apprenant');
  }
  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto mt-16 glass p-6 rounded-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-iris-grad">Tuteur — Connexion</h1>
      <input className="bg-white/5 rounded-xl h-11 w-full px-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="bg-white/5 rounded-xl h-11 w-full px-3" type="password" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} />
      {err && <div className="text-red-400 text-sm">{err}</div>}
      <button disabled={loading} className="btn-cta-lg w-full">{loading?'Connexion…':'Se connecter'}</button>
    </form>
  );
}