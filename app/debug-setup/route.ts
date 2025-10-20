// app/debug-setup/route.ts - Page de debug et setup
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not found' });
  }

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  try {
    // 1. Vérifier les utilisateurs
    const { data: users, error: usersError } = await serviceClient.auth.admin.listUsers();
    
    // 2. Vérifier les organisations
    const { data: orgs, error: orgsError } = await serviceClient
      .from('organizations')
      .select('*')
      .limit(5);

    // 3. Vérifier les memberships
    const { data: memberships, error: membershipsError } = await serviceClient
      .from('org_memberships')
      .select('*')
      .limit(10);

    return NextResponse.json({
      users: users?.users?.map(u => ({ id: u.id, email: u.email })) || [],
      orgs: orgs || [],
      memberships: memberships || [],
      errors: {
        users: usersError?.message,
        orgs: orgsError?.message,
        memberships: membershipsError?.message,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}

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
    // Créer une organisation de test
    const { data: org, error: orgError } = await serviceClient
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

    // Créer un membership admin pour le premier utilisateur
    const { data: users } = await serviceClient.auth.admin.listUsers();
    if (users?.users && users.users.length > 0) {
      const firstUser = users.users[0];
      
      const { error: membershipError } = await serviceClient
        .from('org_memberships')
        .insert({
          user_id: firstUser.id,
          org_id: org.id,
          role: 'admin',
        });

      if (membershipError) {
        return NextResponse.json({ error: 'Failed to create membership: ' + membershipError.message });
      }

      return NextResponse.json({ 
        success: true, 
        org, 
        user: { id: firstUser.id, email: firstUser.email },
        message: 'Test organization and admin membership created successfully'
      });
    }

    return NextResponse.json({ error: 'No users found' });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
