import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

export async function supabaseServer() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Si les variables d'environnement ne sont pas disponibles (build time), retourner un client mock
  if (!url || !anon) {
    console.warn('[supabaseServer] Variables d\'environnement manquantes, utilisation d\'un client mock');
    return createServerClient('https://mock.supabase.co', 'mock-key', {
      cookies: {
        async getAll() {
          return [];
        },
        async setAll() {
          // Mock implementation
        },
      },
    });
  }
  
  return createServerClient(url, anon, {
    cookies: {
      async getAll() {
        return (await cookies()).getAll();
      },
      async setAll(cookiesToSet) {
        const cookieStore = await cookies();
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set({ name, value, ...options });
        });
      },
    },
  });
}