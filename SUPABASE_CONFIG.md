# Configuration Supabase - URLs de redirection

## 🔧 Configuration requise dans Supabase Dashboard

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

## 🔄 Flow d'authentification

### 1. Magic Link / OAuth
- Utilisateur clique sur le lien → `/auth/callback?code=...`
- Route handler échange le code contre une session
- Redirection vers `/` (page racine)
- Page racine lit la session et redirige selon le rôle

### 2. Email + Mot de passe
- Connexion directe côté client
- `setTimeout(() => router.replace('/'), 400)`
- Redirection vers `/` (page racine)

### 3. Redirection par rôle
- `admin`/`instructor` → `/app/formations`
- `learner` → `/app/learning`
- `tutor` → `/app/tutor`

## 🛠️ Politiques RLS requises

Assurez-vous que la politique RLS sur `org_memberships` permet de lire son propre membership :

```sql
CREATE POLICY "Users can view their own memberships" ON org_memberships
  FOR SELECT USING (user_id = auth.uid());
```

## 📁 Fichiers clés

- `app/auth/callback/route.ts` - Échange code → session
- `app/login/page.tsx` - Interface d'authentification
- `app/page.tsx` - Redirection par rôle
- `lib/supabase/{client,server}.ts` - Clients Supabase optimisés
