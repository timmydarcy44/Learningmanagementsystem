import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIX = '/app';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isProtected = pathname.startsWith(PROTECTED_PREFIX);
  const hasSession =
    req.cookies.get('sb-access-token') || req.cookies.get('sb:token') || req.cookies.get('supabase-auth-token');

  if (isProtected && !hasSession) {
    const url = new URL('/login', req.url);
    url.searchParams.set('redirect', pathname + (search || ''));
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
