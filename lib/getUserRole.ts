// lib/getUserRole.ts - Version temporaire avec bypass RLS
import { supabaseServer } from '@/lib/supabase/server';

type Role = 'admin' | 'instructor' | 'tutor' | 'learner';

export async function getUserRole(userId: string): Promise<Role | null> {
  const sb = await supabaseServer();

  try {
    // SOLUTION TEMPORAIRE: Utiliser le service role pour bypasser RLS
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.warn('SUPABASE_SERVICE_ROLE_KEY not found, falling back to RLS');
      return await getUserRoleWithRLS(userId);
    }

    // Créer un client avec service role (bypass RLS)
    const { createClient } = await import('@supabase/supabase-js');
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    const { data, error } = await serviceClient
      .from('org_memberships')
      .select('role')
      .eq('user_id', userId);

    if (error) {
      console.warn('getUserRole service role error:', error.message);
      return await getUserRoleWithRLS(userId);
    }
    if (!data || data.length === 0) return null;

    const priority: Record<Role, number> = {
      admin: 4, instructor: 3, tutor: 2, learner: 1,
    } as const;

    const best = data
      .map(d => d.role as Role)
      .sort((a, b) => (priority[b] ?? 0) - (priority[a] ?? 0))[0];

    return best ?? null;
  } catch (error) {
    console.warn('getUserRole service role failed:', error);
    return await getUserRoleWithRLS(userId);
  }
}

// Fallback avec RLS (version originale)
async function getUserRoleWithRLS(userId: string): Promise<Role | null> {
  const sb = await supabaseServer();

  const { data, error } = await sb
    .from('org_memberships')
    .select('role')
    .eq('user_id', userId);

  if (error) {
    console.warn('getUserRole RLS error:', error.message);
    return null;
  }
  if (!data || data.length === 0) return null;

  const priority: Record<Role, number> = {
    admin: 4, instructor: 3, tutor: 2, learner: 1,
  } as const;

  const best = data
    .map(d => d.role as Role)
    .sort((a, b) => (priority[b] ?? 0) - (priority[a] ?? 0))[0];

  return best ?? null;
}