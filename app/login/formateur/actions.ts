'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function instructorPasswordLogin(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const cookieStore = await cookies();
  const supabase = createServerClient(
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

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // On renvoie à la page avec un flag d'erreur lisible
    redirect(`/login/formateur?error=invalid`);
  }

  // Succès : cookies posés côté serveur → go /formateur
  redirect('/formateur');
}
