import { supabaseServer } from '@/lib/supabase/server';

export async function getSessionUser() {
  const sb = await supabaseServer();
  const { data: { user }, error } = await sb.auth.getUser();
  if (error) return { user: null };
  return { user };
}
