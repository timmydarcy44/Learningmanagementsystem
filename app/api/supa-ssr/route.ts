import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  const sb = await supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  const { data: ping, error } = await sb.from('organizations').select('id').limit(1);

  return NextResponse.json({
    user_present: !!auth?.user,
    orgs_query_ok: !error,
    orgs_count: ping?.length ?? 0,
  });
}
