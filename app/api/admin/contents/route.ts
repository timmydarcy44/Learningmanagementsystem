// app/api/admin/contents/route.ts
import { NextResponse } from 'next/server';
import { supabaseServerActions } from '@/lib/supabase/server-actions';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const sb = await supabaseServerActions();
    const { data: { user } } = await sb.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer le paramètre orgId depuis l'URL
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');

    let targetOrgId: string;

    if (orgId) {
      // Vérifier que l'utilisateur appartient à cette organisation
      const { data: membership } = await sb
        .from('org_memberships')
        .select('org_id, role')
        .eq('user_id', user.id)
        .eq('org_id', orgId)
        .in('role', ['admin', 'instructor'])
        .single();

      if (!membership) {
        return NextResponse.json({ error: 'Permissions insuffisantes pour cette organisation' }, { status: 403 });
      }
      targetOrgId = orgId;
    } else {
      // Logique de fallback : récupérer la première organisation de l'utilisateur
      const { data: membership } = await sb
        .from('org_memberships')
        .select('org_id, role')
        .eq('user_id', user.id)
        .in('role', ['admin', 'instructor'])
        .order('role', { ascending: false }) // admin en premier
        .single();

      if (!membership) {
        return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
      }
      targetOrgId = membership.org_id;
    }

    // Récupérer tous les contenus en parallèle
    const [formationsResult, resourcesResult, testsResult, pathwaysResult] = await Promise.all([
      sb.from('formations')
        .select('id, title, published')
        .eq('org_id', targetOrgId)
        .order('title'),
      
      sb.from('resources')
        .select('id, title, published')
        .eq('org_id', targetOrgId)
        .order('title'),
      
      sb.from('tests')
        .select('id, title, published')
        .eq('org_id', targetOrgId)
        .order('title'),
      
      sb.from('pathways')
        .select('id, title, published')
        .eq('org_id', targetOrgId)
        .order('title')
    ]);

    return NextResponse.json({
      formations: formationsResult.data || [],
      resources: resourcesResult.data || [],
      tests: testsResult.data || [],
      pathways: pathwaysResult.data || []
    });

  } catch (error: any) {
    console.error('Error fetching contents:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
