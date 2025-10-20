import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Missing Supabase config' }, { status: 500 });
  }

  const sb = createClient(url, serviceKey);
  const out: any = {};

  const user = (await sb.auth.getUser()).data.user;
  out.user = user ? { id: user.id, email: user.email } : null;

  // Vérifie qu'on peut SELECT sans RLS bloquante
  const mem = await sb.from('org_memberships').select('org_id, user_id, role').limit(3);
  out.memberships = { error: mem.error?.message ?? null, count: mem.data?.length ?? 0 };

  const rc = await sb.from('rich_contents').select('id, chapter_id, subchapter_id').limit(1);
  out.rich_contents = { error: rc.error?.message ?? null, count: rc.data?.length ?? 0 };

  const as = await sb.from('assets').select('bucket, object_name').limit(1);
  out.assets = { error: as.error?.message ?? null, count: as.data?.length ?? 0 };

  return NextResponse.json(out);
}
