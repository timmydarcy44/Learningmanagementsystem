import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const admin = supabaseAdmin();
    // petit ping DB côté service role (bypass RLS)
    const { data, error } = await admin.from('organizations').select('id').limit(1);
    return NextResponse.json({ ok: !error, sample: data?.[0]?.id ?? null });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message ?? 'unknown' }, { status: 500 });
  }
}
