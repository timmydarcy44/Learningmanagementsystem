'use server';

import { supabaseServer } from '@/lib/supabase/server';

export async function getPublicUrl(objectName: string) {
  const sb = await supabaseServer();
  const { data } = sb.storage.from('lms-assets').getPublicUrl(objectName);
  return data.publicUrl;
}

export async function createSignedUrl(objectName: string, seconds = 3600) {
  const sb = await supabaseServer();
  const { data, error } = await sb.storage.from('lms-assets').createSignedUrl(objectName, seconds);
  if (error) throw error;
  return data.signedUrl;
}