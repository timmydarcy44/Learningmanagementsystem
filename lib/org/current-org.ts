import { supabaseServer } from '@/lib/supabase/server';

export async function getCurrentOrgId(userId: string): Promise<string> {
  const supabase = await supabaseServer();
  
  const { data: memberships, error } = await supabase
    .from('org_memberships')
    .select('org_id')
    .eq('user_id', userId)
    .limit(1);

  if (error) {
    throw new Error(`Failed to fetch user memberships: ${error.message}`);
  }

  if (!memberships || memberships.length === 0) {
    throw new Error('User is not a member of any organization');
  }

  return memberships[0].org_id;
}
