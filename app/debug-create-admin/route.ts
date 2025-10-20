// app/debug-create-admin/route.ts - Créer un membership admin
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not found' });
  }

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  try {
    // 1. Récupérer le premier utilisateur
    const { data: users } = await serviceClient.auth.admin.listUsers();
    if (!users?.users || users.users.length === 0) {
      return NextResponse.json({ error: 'No users found' });
    }
    const firstUser = users.users[0];

    // 2. Récupérer ou créer une organisation
    let { data: orgs } = await serviceClient
      .from('organizations')
      .select('*')
      .limit(1);

    let org;
    if (!orgs || orgs.length === 0) {
      // Créer une organisation
      const { data: newOrg, error: orgError } = await serviceClient
        .from('organizations')
        .insert({
          name: 'Test Organization',
          slug: 'test-org',
        })
        .select()
        .single();
      
      if (orgError) {
        return NextResponse.json({ error: 'Failed to create org: ' + orgError.message });
      }
      org = newOrg;
    } else {
      org = orgs[0];
    }

    // 3. Vérifier si le membership existe déjà
    const { data: existingMembership } = await serviceClient
      .from('org_memberships')
      .select('*')
      .eq('user_id', firstUser.id)
      .eq('org_id', org.id)
      .single();

    if (existingMembership) {
      return NextResponse.json({ 
        success: true, 
        message: 'Admin membership already exists',
        user: { id: firstUser.id, email: firstUser.email },
        org: org,
        membership: existingMembership
      });
    }

    // 4. Créer le membership admin
    const { data: membership, error: membershipError } = await serviceClient
      .from('org_memberships')
      .insert({
        user_id: firstUser.id,
        org_id: org.id,
        role: 'admin',
      })
      .select()
      .single();

    if (membershipError) {
      return NextResponse.json({ error: 'Failed to create membership: ' + membershipError.message });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin membership created successfully',
      user: { id: firstUser.id, email: firstUser.email },
      org: org,
      membership: membership
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
