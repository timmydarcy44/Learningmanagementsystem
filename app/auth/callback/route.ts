import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getUserRole } from '@/lib/getUserRole';
import { cookies, headers } from 'next/headers';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next'); // optionnel
  const res = NextResponse.redirect(new URL(next ?? '/', req.url));

  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookies()).getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    if (code) await sb.auth.exchangeCodeForSession(code);
  } catch (e) {
    console.error('exchangeCodeForSession error', e);
    return NextResponse.redirect(new URL('/login/admin?error=callback', req.url));
  }

  // si next est donné (ex: /create-password), on le respecte
  if (next) return res;

  // sinon, route par rôle
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login/admin', req.url));

  const role = await getUserRole(user.id);
  switch (role) {
    case 'admin': return NextResponse.redirect(new URL('/admin', req.url));
    case 'instructor': return NextResponse.redirect(new URL('/formateur', req.url));
    case 'tutor': return NextResponse.redirect(new URL('/tuteur', req.url));
    case 'learner': return NextResponse.redirect(new URL('/apprenant', req.url));
    default: return NextResponse.redirect(new URL('/login/admin', req.url));
  }
}