import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pour l'instant, redirige simplement vers /login si pas connecté
  // et vers /app/formations si connecté
  if (pathname === '/') {
    // Vérifier s'il y a des cookies de session (approximation)
    const hasSession = req.cookies.get('sb-access-token') || 
                      req.cookies.get('sb:token') || 
                      req.cookies.get('supabase-auth-token');

    if (hasSession) {
      return NextResponse.redirect(new URL('/app/formations', req.url));
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Protection des routes /app
  if (pathname.startsWith('/app') && !pathname.startsWith('/app/login')) {
    const hasSession = req.cookies.get('sb-access-token') || 
                      req.cookies.get('sb:token') || 
                      req.cookies.get('supabase-auth-token');

    if (!hasSession) {
      const url = new URL('/login', req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/app/:path*'],
};