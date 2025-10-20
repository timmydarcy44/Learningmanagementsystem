import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/getUserRole';

export default async function HomePage() {
  // Vérifier les variables d'environnement
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect('/login');
  }

  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const role = await getUserRole(user.id);
  
  switch (role) {
    case 'admin':
      redirect('/admin');
    case 'instructor':
      redirect('/formateur');
    case 'tutor':
      redirect('/tuteur');
    case 'learner':
      redirect('/apprenant');
    default:
      redirect('/login');
  }
}