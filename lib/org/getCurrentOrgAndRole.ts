import { supabaseServer } from '@/lib/supabase/server';

export async function getCurrentOrgAndRole(userId: string) {
  const sb = await supabaseServer();
  const { data, error } = await sb
    .from('org_memberships')
    .select('org_id, role')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null; // { org_id, role } or null
}
