import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const service = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    return NextResponse.json({
      NEXT_PUBLIC_SUPABASE_URL_present: Boolean(url),
      NEXT_PUBLIC_SUPABASE_ANON_KEY_present: Boolean(anon),
      SUPABASE_SERVICE_ROLE_KEY_present: service,
      url_preview: url.startsWith('http') ? url.slice(0, 40) : url,
      anon_len: anon.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check environment variables' }, { status: 500 });
  }
}