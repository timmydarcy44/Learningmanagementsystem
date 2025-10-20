// lib/url.ts (server only)
import { headers } from 'next/headers';

export async function absoluteUrl(path: string) {
  const h = await headers();
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host  = h.get('x-forwarded-host')  ?? h.get('host') ?? 'localhost:3000';
  const base = `${proto}://${host}`;
  return new URL(path, base).toString();
}
