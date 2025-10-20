import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();

  let membership = null, orgs = null;
  if (user) {
    const { data: mem } = await sb.from('org_memberships').select('org_id, role').eq('user_id', user.id);
    membership = mem;
    const { data: orgList } = await sb.from('organizations').select('id, slug, name').limit(5);
    orgs = orgList;
  }

  return NextResponse.json({
    user: user ? { id: user.id, email: user.email } : null,
    membership,
    orgs
  });
}