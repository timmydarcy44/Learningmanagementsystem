// app/(dashboard)/tuteur/layout.tsx
export const dynamic = 'force-dynamic'; export const revalidate = 0;
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { getPrimaryRole } from '@/lib/roles';
import AppShell from '@/components/layout/AppShell';

export default async function TuteurLayout({ children }: { children: React.ReactNode }) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect('/login/tuteur');
  const role = await getPrimaryRole(user.id);
  if (role !== 'tutor') redirect('/unauthorized');
  return <AppShell role="tutor">{children}</AppShell>;
}