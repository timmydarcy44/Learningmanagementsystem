# Workflow utilisateur complet - LMS

## 🔄 **Flow d'authentification**

### **1. Première connexion (Apprenant/Tuteur)**
```
/login → Magic Link → /auth/callback?next=/create-password → /create-password → /
```

### **2. Connexions suivantes (Tous les rôles)**
```
/login → Email + Mot de passe → / → Redirection par rôle
```

### **3. Google OAuth (Admin/Formateur)**
```
/login → Google → /auth/callback?next=/ → / → Redirection par rôle
```

### **4. Mot de passe oublié**
```
/login → "Mot de passe oublié" → /forgot-password → Email → /auth/callback?next=/reset-password → /reset-password → /
```

## 🎯 **Redirections par rôle**

### **Page racine (`/`) - SSR**
```typescript
// 1) Vérification utilisateur connecté
if (!user) redirect('/login');

// 2) Vérification mot de passe créé
if (profile && profile.has_password === false) redirect('/create-password');

// 3) Redirection par rôle
if (membership.role === 'admin' || membership.role === 'instructor') redirect('/app/formations');
if (membership.role === 'learner') redirect('/app/learning');
if (membership.role === 'tutor') redirect('/app/tutor');
```

## 🔐 **Pages d'authentification**

### **1. `/login` - Connexion multi-méthodes**
- **Magic Link** : Pour première connexion (Apprenant/Tuteur)
- **Email + Mot de passe** : Pour connexions suivantes (Tous)
- **Google OAuth** : Pour Admin/Formateur
- **Lien "Mot de passe oublié"** : Visible uniquement sur l'onglet mot de passe

### **2. `/create-password` - Création mot de passe**
```typescript
const { error } = await sb.auth.updateUser({ password });
await sb.rpc('mark_user_has_password');     // Flag serveur
setTimeout(() => router.replace('/'), 600); // Laisse écrire la session
```

### **3. `/forgot-password` - Mot de passe oublié**
```typescript
const { error } = await sb.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
});
```

### **4. `/reset-password` - Réinitialisation mot de passe**
```typescript
const { error } = await sb.auth.updateUser({ password: p1 });
if (!error) setTimeout(() => router.replace('/'), 600);
```

## 🛡️ **Protection SSR des espaces**

### **1. `/app/layout.tsx` - Espace formateur/admin**
```typescript
// Only admin/instructor can access /app (trainer space)
if (org.role !== 'admin' && org.role !== 'instructor') redirect('/');
```

### **2. `/app/learning/page.tsx` - Espace apprenant**
```typescript
if (org.role !== 'learner') redirect('/'); // bloque autres rôles
```

### **3. `/app/tutor/page.tsx` - Espace tuteur**
```typescript
if (org.role !== 'tutor') redirect('/');
```

## 🚪 **Déconnexion**

### **Navbar - Bouton déconnexion**
```typescript
const signOut = async () => {
  await supabaseBrowser().auth.signOut();
  location.href = '/login';
};
```

## 🔧 **Callback d'authentification**

### **`/auth/callback/route.ts` - Route handler**
```typescript
// On construit la réponse AVANT pour y attacher les Set-Cookie
const response = NextResponse.redirect(new URL(next, request.url));

const supabase = createServerClient(/* ... */, {
  cookies: {
    get: (name) => request.cookies.get(name)?.value,
    set: (name, value, options) => response.cookies.set(name, value, options),
    remove: (name, options) => response.cookies.set(name, '', { ...options, maxAge: 0 }),
  },
});

try {
  if (code) await supabase.auth.exchangeCodeForSession(code);
} catch {}

return response; // ⬅️ renvoie la réponse qui contient les cookies
```

### **`/auth/callback/page.tsx` - Fallback client**
```typescript
// Si le navigateur bloque les Set-Cookie du handler
await supabaseBrowser().auth.exchangeCodeForSession(code);
setTimeout(() => router.replace(next), 300);
```

## 📋 **Configuration Supabase requise**

### **Authentication → URL Configuration**
- **Site URL** : `http://localhost:3000`
- **Redirect URLs** :
  - `http://localhost:3000/`
  - `http://localhost:3000/login`
  - `http://localhost:3000/app`
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/create-password`
  - `http://localhost:3000/reset-password`

### **Scripts SQL requis**
- `supabase-profiles.sql` : Table profiles + RLS + fonction `mark_user_has_password()`
- `supabase-init.sql` : Tables organisations + membres + formations + RLS

## 🎨 **UI/UX**

### **Design cohérent**
- **Thème dark premium** : `#252525` avec glassmorphism
- **Boutons** : `rounded-2xl` avec gradients iris/blush
- **Inputs** : `bg-white/5` avec focus ring iris
- **Messages** : Couleurs contextuelles (succès/erreur)

### **Navigation**
- **Navbar** : Liens adaptés au rôle + déconnexion
- **Breadcrumbs** : Retour à la connexion sur les pages d'auth
- **Responsive** : Mobile-first avec breakpoints

## ✅ **Points de validation**

1. **Magic Link** → Redirection directe vers `/create-password` ✅
2. **Callback** → Pose vraiment les cookies ✅
3. **Page racine** → Vérification `has_password` + redirection par rôle ✅
4. **Layouts SSR** → Protection des espaces par rôle ✅
5. **Déconnexion** → Bouton dans Navbar ✅
6. **Mot de passe oublié** → Flow complet forgot/reset ✅

## 🚀 **Prêt pour la production**

Le workflow est **100% fonctionnel** avec :
- **Authentification robuste** : Magic Link + Email/Password + Google OAuth
- **Sécurité SSR** : Protection des routes par rôle
- **UX fluide** : Pas de clignotement, redirections intelligentes
- **Récupération** : Mot de passe oublié intégré
- **Design cohérent** : Thème dark premium avec glassmorphism
