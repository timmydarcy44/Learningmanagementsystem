'use client';
import { createBrowserClient } from '@supabase/ssr';

function clean(v?: string | null) {
  return (v ?? '').trim().replace(/^['"]|['"]$/g, '');
}

let _client: ReturnType<typeof createBrowserClient> | null = null;

export function supabaseBrowser() {
  if (_client) return _client;
  const rawUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const url  = clean(rawUrl);
  const anon = clean(rawAnon);

  // Si les variables d'environnement ne sont pas disponibles (build time), retourner un client mock
  if (!url || !anon) {
    console.warn('[supabaseBrowser] Variables d\'environnement manquantes, utilisation d\'un client mock');
    _client = createBrowserClient('https://mock.supabase.co', 'mock-key');
    return _client;
  }

  try { new URL(url); } catch {
    throw new Error(`[supabaseBrowser] Invalid NEXT_PUBLIC_SUPABASE_URL: "${rawUrl}"`);
  }

  _client = createBrowserClient(url, anon);
  return _client;
}