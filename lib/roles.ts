// lib/roles.ts
import { createClient } from '@supabase/supabase-js';

export type Role = 'admin' | 'instructor' | 'tutor' | 'learner';

export async function getPrimaryRole(userId: string): Promise<Role | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    return null;
  }

  const sb = createClient(url, serviceKey);
  const { data, error } = await sb.from('org_memberships').select('role').eq('user_id', userId);
  if (error || !data || data.length === 0) return null;
  const priority: Role[] = ['admin','instructor','tutor','learner'];
  return priority.find(r => data.some(d => d.role === r)) ?? (data[0].role as Role);
}

export function routeForRole(role: Role) {
  switch (role) {
    case 'admin': return '/admin';
    case 'instructor': return '/formateur';
    case 'tutor': return '/tuteur';
    case 'learner': return '/apprenant';
  }
}
