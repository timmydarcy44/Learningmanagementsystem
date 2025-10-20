// lib/supabase/server-actions.ts
// Client Supabase pour les Server Actions (peut modifier les cookies)
import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function supabaseServerActions() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error('[supabaseServerActions] Missing SUPABASE env');

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set({ name, value, ...options });
        });
      },
    },
  });
}
