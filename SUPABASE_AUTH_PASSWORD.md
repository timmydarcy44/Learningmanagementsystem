# Configuration Supabase - Authentification avec Création de Mot de Passe

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
http://localhost:3000/create-password
```

## 🔑 Variables d'environnement

**Fichier `.env.local` :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🗄️ Base de données

**Exécutez le script SQL `supabase-profiles.sql` dans l'éditeur SQL de Supabase :**

- Crée la table `profiles` avec `has_password`
- Configure les politiques RLS
- Crée la fonction `mark_user_has_password()`
- Ajoute un trigger pour créer automatiquement les profils

## 🔄 Flow d'authentification complet

### 1. Magic Link / OAuth (première connexion)
- Utilisateur → `/auth/callback?code=...&next=/`
- Route handler échange le code contre une session
- Vérifie `has_password` dans `profiles`
- Si `has_password = false` → redirection vers `/create-password`
- Sinon → redirection vers `/` → redirection par rôle

### 2. Magic Link / OAuth (connexions suivantes)
- Utilisateur → `/auth/callback?code=...&next=/`
- Route handler échange le code contre une session
- `has_password = true` → redirection vers `/` → redirection par rôle

### 3. Email + Mot de passe
- Connexion directe côté client
- `setTimeout(400ms)` → redirection → `/`
- Page racine vérifie `has_password` → redirection par rôle

### 4. Création de mot de passe
- Page `/create-password` : formulaire de création
- Appel `supabase.auth.updateUser({ password })`
- Appel `supabase.rpc('mark_user_has_password')`
- `setTimeout(600ms)` → redirection vers `/`

### 5. Redirection par rôle
- `admin`/`instructor` → `/app/formations`
- `learner` → `/app/learning`
- `tutor` → `/app/tutor`

## 🛠️ Politiques RLS requises

```sql
-- Table profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Table org_memberships
CREATE POLICY "Users can view their own memberships" ON org_memberships
  FOR SELECT USING (user_id = auth.uid());
```

## 📁 Fichiers clés

- `app/create-password/page.tsx` - Page de création de mot de passe
- `app/auth/callback/route.ts` - Route handler avec vérification `has_password`
- `app/page.tsx` - Redirection par rôle avec vérification `has_password`
- `app/login/page.tsx` - Interface d'authentification
- `supabase-profiles.sql` - Script SQL pour la table profiles

## 🚀 Redémarrage

```bash
Ctrl+C
rm -rf .next .turbo
npm run dev
```

## ✅ Double sécurité

Le système utilise deux mécanismes de vérification :
1. **Route handler** : Vérification côté serveur dans le callback
2. **Page racine** : Vérification côté serveur avant redirection par rôle

Si l'utilisateur n'a pas de mot de passe, il est automatiquement redirigé vers `/create-password`.
