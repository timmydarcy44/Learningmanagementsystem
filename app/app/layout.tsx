import { supabaseServer } from '@/lib/supabase/server';
import Navbar from '@/components/layout/Navbar';
import { redirect } from 'next/navigation';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect('/login');
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-8">{children}</main>
    </div>
  );
}
