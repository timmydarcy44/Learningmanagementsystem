// lib/org.ts - Version temporaire avec bypass RLS
import { supabaseServer } from '@/lib/supabase/server';

export async function getDefaultOrgId(): Promise<string | null> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  const { data, error } = await sb
    .from('org_memberships')
    .select('org_id, role')
    .eq('user_id', user.id);

  if (error || !data?.length) return null;

  const admin = data.find(d => d.role === 'admin');
  const instructor = data.find(d => d.role === 'instructor');
  return (admin ?? instructor ?? data[0]).org_id;
}

// Alias pour compatibilité
export const getCurrentOrgId = getDefaultOrgId;

export type CurrentOrg =
  | { id: string; slug: string | null; name: string | null }
  | null;

/**
 * Renvoie l'organisation "courante" de l'utilisateur connecté.
 * SOLUTION TEMPORAIRE: Utilise le service role pour bypasser RLS
 */
export async function getCurrentOrg(): Promise<CurrentOrg> {
  const sb = await supabaseServer();

  // 1) user
  const { data: { user }, error: userErr } = await sb.auth.getUser();
  if (userErr || !user) return null;

  try {
    // SOLUTION TEMPORAIRE: Utiliser le service role pour bypasser RLS
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.warn('SUPABASE_SERVICE_ROLE_KEY not found, falling back to RLS');
      return await getCurrentOrgWithRLS(user.id);
    }

    // Créer un client avec service role (bypass RLS)
    const { createClient } = await import('@supabase/supabase-js');
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    // 2) memberships -> org avec service role
    const { data: memberships, error: memErr } = await serviceClient
      .from('org_memberships')
      .select('org_id, role, organizations!inner(id, slug, name)')
      .eq('user_id', user.id)
      .order('role', { ascending: true })
      .limit(10);

    if (memErr) {
      console.warn('getCurrentOrg service role memberships error:', memErr.message);
      return await getCurrentOrgWithRLS(user.id);
    }

    if (!memberships || memberships.length === 0) {
      return null;
    }

    // essaie de trouver un admin d'abord
    const adminMem = memberships.find(m => m.role === 'admin');
    const pick = adminMem ?? memberships[0];

    // `organizations` est retourné comme alias imbriqué : organisations: { id, slug, name }
    const org = (pick as any).organizations;
    if (!org?.id) return null;

    return { id: org.id as string, slug: org.slug ?? null, name: org.name ?? null };
  } catch (error) {
    console.warn('getCurrentOrg service role failed:', error);
    return await getCurrentOrgWithRLS(user.id);
  }
}

// Fallback avec RLS (version originale)
async function getCurrentOrgWithRLS(userId: string): Promise<CurrentOrg> {
  const sb = await supabaseServer();

  const { data: memberships, error: memErr } = await sb
    .from('org_memberships')
    .select('org_id, role, organizations!inner(id, slug, name)')
    .eq('user_id', userId)
    .order('role', { ascending: true })
    .limit(10);

  if (memErr) {
    console.warn('getCurrentOrg RLS memberships error:', memErr.message);
    return null;
  }

  if (!memberships || memberships.length === 0) {
    return null;
  }

  const adminMem = memberships.find(m => m.role === 'admin');
  const pick = adminMem ?? memberships[0];

  const org = (pick as any).organizations;
  if (!org?.id) return null;

  return { id: org.id as string, slug: org.slug ?? null, name: org.name ?? null };
}