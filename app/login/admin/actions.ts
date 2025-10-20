'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function adminPasswordLogin(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const cookieStore = await cookies();
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookies()).getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    redirect('/login/admin?error=invalid');
  }

  // Succès : route directement vers /admin (guard SSR verra la session)
  redirect('/admin');
}