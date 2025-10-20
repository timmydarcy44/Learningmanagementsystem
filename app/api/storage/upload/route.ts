import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const sb = await supabaseServer();
    const { data: { user } } = await sb.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { objectName, file } = await req.json();

    // Convert base64 to buffer
    const buffer = Buffer.from(file, 'base64');

    // Upload to Supabase Storage
    const { data, error } = await sb.storage
      .from('lms-assets')
      .upload(objectName, buffer, {
        contentType: 'application/octet-stream',
        upsert: true
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = sb.storage
      .from('lms-assets')
      .getPublicUrl(objectName);

    return NextResponse.json({ 
      url: urlData.publicUrl,
      path: data.path 
    }, { status: 200 });
  } catch (error) {
    console.error('Error in storage upload API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
