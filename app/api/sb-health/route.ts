import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const sb = createClient(url, anon);
  const { data, error } = await sb.from('formations').select('id').limit(1);
  return NextResponse.json({ ok: !error, error: error?.message ?? null });
}
