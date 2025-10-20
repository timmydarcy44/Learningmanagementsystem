# Configuration Supabase - Callback qui POSE vraiment les cookies

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

## 🔄 Flow d'authentification corrigé

### 1. Magic Link / OAuth
- Utilisateur → `/auth/callback?code=...&next=/`
- Route handler échange le code contre une session
- **Cookies écrits dans la réponse HTTP** ✅
- Redirection vers `/` → vérification `has_password` → redirection par rôle

### 2. Email + Mot de passe
- Connexion directe côté client
- `setTimeout(400ms)` → redirection → `/`
- Vérification `has_password` → redirection par rôle

### 3. Création de mot de passe
- Si `has_password = false` → `/create-password`
- Appel `supabase.auth.updateUser({ password })`
- Appel `supabase.rpc('mark_user_has_password')`
- Redirection vers `/`

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

## 📁 Fichiers clés corrigés

- `app/auth/callback/route.ts` - **Callback simplifié qui pose vraiment les cookies**
- `app/login/page.tsx` - Redirections vers `/auth/callback?next=/`
- `app/page.tsx` - Vérification `has_password` avant redirection par rôle
- `app/create-password/page.tsx` - Création de mot de passe
- `app/debug-auth/page.tsx` - **Page de debug pour diagnostiquer**

## 🚀 Redémarrage

```bash
Ctrl+C
rm -rf .next .turbo
npm run dev
```

## 🔍 Debug

**Allez sur `http://localhost:3000/debug-auth` après login :**

Attendu :
```json
{
  "user": { "id": "...", "email": "..." },
  "profile": { "has_password": true/false },
  "membership": { "org_id": "...", "role": "admin" }
}
```

Si `user: null` → le cookie n'est pas posé → vérifiez le callback
Si `profile: null` → exécutez le script SQL
Si `membership: null` → vérifiez les politiques RLS

## ⚠️ Micro-pièges courants

1. **URL** : Utilisez `http://localhost:3000` (pas `127.0.0.1`)
2. **Cache** : Videz le cache + cookies du site si vous avez testé plusieurs fois
3. **Packages** : Utilisez `@supabase/ssr` (pas `@supabase/supabase-js` brut)
4. **Redémarrage** : Toujours redémarrer après modifications

## ✅ Callback corrigé

Le callback est maintenant **simplifié et fonctionnel** :
- Crée une réponse de redirection
- Échange le code contre une session
- **Pose les cookies dans la réponse**
- Retourne la réponse avec les cookies

Plus de logique complexe qui peut échouer !
