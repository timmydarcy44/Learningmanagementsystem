# Configuration Supabase - Authentification Complète

## 🔧 Prérequis Supabase Dashboard

### Authentication → URL Configuration

**Site URL :**
```
http://localhost:3000
```

**Redirect URLs (ajoutez-les toutes) :**
```
http://localhost:3000/
http://localhost:3000/login
http://localhost:3000/app
http://localhost:3000/auth/callback
```

## 🔑 Variables d'environnement

**Fichier `.env.local` (en clair, pas chiffré) :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🔄 Flow d'authentification complet

### 1. Magic Link / OAuth
- Utilisateur → `/auth/callback?code=...&next=/`
- Route handler échange le code contre une session (cookies écrits dans la réponse)
- Si échec → Page client de secours fait l'échange côté browser
- Redirection vers `/` → redirection par rôle côté serveur

### 2. Email + Mot de passe
- Connexion directe côté client
- `setTimeout(400ms)` → redirection → `/`
- Redirection par rôle côté serveur

### 3. Redirection par rôle
- `admin`/`instructor` → `/app/formations`
- `learner` → `/app/learning`
- `tutor` → `/app/tutor`

## 🛠️ Politiques RLS requises

```sql
CREATE POLICY "Users can view their own memberships" ON org_memberships
  FOR SELECT USING (user_id = auth.uid());
```

## 📁 Fichiers clés

- `app/auth/callback/route.ts` - Route handler (échange code → session)
- `app/auth/callback/page.tsx` - Page client de secours
- `app/login/page.tsx` - Interface d'authentification
- `app/page.tsx` - Redirection par rôle
- `lib/supabase/{client,server}.ts` - Clients Supabase optimisés

## 🚀 Redémarrage

```bash
Ctrl+C
rm -rf .next .turbo
npm run dev
```

## ✅ Double sécurité

Le système utilise deux mécanismes de callback :
1. **Route handler** : Échange côté serveur (recommandé)
2. **Page client** : Échange côté browser (plan B)

Si l'un échoue, l'autre réussit automatiquement.
