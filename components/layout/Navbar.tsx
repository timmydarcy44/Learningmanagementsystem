'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import Link from 'next/link';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [supabaseError, setSupabaseError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const supabase = supabaseBrowser();
      supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    } catch (error) {
      setSupabaseError(true);
    }
  }, []);

  const signOut = async () => {
    try {
      const supabase = supabaseBrowser();
      await supabase.auth.signOut();
      location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/app" className="text-xl font-semibold">
          <span className="text-grad bg-iris-grad">LMS.</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/app" className="text-sm text-neutral-200 hover:underline">Tableau de bord</Link>
          {supabaseError ? (
            <Link href="/config" className="rounded-2xl px-4 h-10 border border-white/10 hover:bg-white/5">Configurer</Link>
          ) : email ? (
            <>
              <span className="text-sm text-neutral-400 hidden sm:inline">{email}</span>
              <button onClick={signOut} className="rounded-2xl px-4 h-10 bg-iris-grad text-white hover:opacity-90">
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded-2xl px-4 h-10 border border-white/10 hover:bg-white/5">Connexion</Link>
          )}
        </nav>
      </div>
    </header>
  );
}