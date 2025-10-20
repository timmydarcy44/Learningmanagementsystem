# Flow d'authentification corrigé - Magic Link → /create-password

## 🔄 **Nouveau flow d'authentification**

### 1. **Magic Link (première connexion)**
- Utilisateur saisit son email → `/login`
- Clic sur "Recevoir le lien" → `signInWithOtp()`
- **Redirection directe** : `/auth/callback?next=/create-password`
- Callback échange le code → pose les cookies → redirige vers `/create-password`
- Utilisateur crée son mot de passe → redirige vers `/` (page racine)

### 2. **Email + Mot de passe (connexions suivantes)**
- Utilisateur saisit email + mot de passe → `/login`
- Clic sur "Se connecter" → `signInWithPassword()`
- Connexion directe → `setTimeout(400ms)` → redirige vers `/`
- Page racine vérifie `has_password` → redirige par rôle

### 3. **Google OAuth**
- Clic sur "Se connecter avec Google" → `signInWithOAuth()`
- Redirection Google → `/auth/callback?next=/`
- Callback échange le code → pose les cookies → redirige vers `/`
- Page racine vérifie `has_password` → redirige par rôle

## 🔧 **Fichiers corrigés**

### `app/login/page.tsx` - Magic Link corrigé
```typescript
const { error } = await sb.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback?next=/create-password`,
  },
});
```

### `app/auth/callback/route.ts` - Callback qui ÉCRIT les cookies
```typescript
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/';

  // On construit la réponse AVANT pour y attacher les Set-Cookie
  const response = NextResponse.redirect(new URL(next, request.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => response.cookies.set(name, value, options),
        remove: (name, options) => response.cookies.set(name, '', { ...options, maxAge: 0 }),
      },
    }
  );

  try {
    if (code) await supabase.auth.exchangeCodeForSession(code);
  } catch {}

  return response; // ⬅️ renvoie la réponse qui contient les cookies
}
```

### `app/auth/callback/page.tsx` - Fallback client
```typescript
'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function AuthCallbackFallback() {
  const router = useRouter();
  const sp = useSearchParams();
  const code = sp.get('code');
  const next = sp.get('next') || '/';

  useEffect(() => {
    (async () => {
      if (!code) { router.replace('/login'); return; }
      try {
        await supabaseBrowser().auth.exchangeCodeForSession(code);
      } catch {}
      setTimeout(() => router.replace(next), 300);
    })();
  }, [code, next, router]);

  return null;
}
```

## 🎯 **Avantages du nouveau flow**

1. **Magic Link** → **Redirection directe** vers `/create-password`
   - Plus de vérification `has_password` dans le callback
   - Flow plus simple et prévisible
   - L'utilisateur sait exactement où il va

2. **Callback simplifié**
   - Se contente d'échanger le code contre une session
   - Pose les cookies dans la réponse HTTP
   - Redirige vers la destination demandée

3. **Fallback robuste**
   - Si le navigateur bloque les Set-Cookie du handler
   - L'échange se fait côté client
   - Redirection après 300ms

## 🔍 **Configuration Supabase requise**

**Dans Supabase Dashboard → Authentication → URL Configuration :**

- **Site URL** : `http://localhost:3000`
- **Redirect URLs** :
  - `http://localhost:3000/`
  - `http://localhost:3000/login`
  - `http://localhost:3000/app`
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/create-password`

## 🚀 **Test du flow**

1. **Première connexion** :
   - Email → Magic Link → `/create-password`
   - Créer mot de passe → `/` → redirection par rôle

2. **Connexions suivantes** :
   - Email + mot de passe → `/` → redirection par rôle

3. **Debug** :
   - `/debug-auth` pour vérifier l'état d'authentification

## ✅ **Résultat attendu**

- **Magic Link** : Redirection directe vers `/create-password` ✅
- **Callback** : Pose vraiment les cookies ✅
- **Fallback** : Fonctionne si le navigateur bloque les cookies ✅
- **Flow** : Simple, prévisible et robuste ✅
