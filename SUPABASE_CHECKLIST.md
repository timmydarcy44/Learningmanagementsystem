# 🔧 Configuration Supabase - Checklist rapide

## ✅ À vérifier dans votre Supabase Dashboard

### 1. Auth → Providers → Email
- **"Email/Password"** doit être **Enabled** ✅
- **"Confirm email"** peut être activé ou désactivé selon vos besoins

### 2. Auth → URL Configuration
- **Site URL** : `http://localhost:3000` ✅
- **Redirect URLs** : ajouter `http://localhost:3000/auth/callback` ✅

### 3. Auth → Users
- Vérifier que l'utilisateur `timmydarcy44@gmail.com` existe ✅
- Si il n'existe pas, le créer manuellement ou utiliser le flux "Mot de passe oublié"

## 🚀 Flux de test maintenant disponible

### Procédure exacte à suivre :

1. **Ouvrez** `http://localhost:3000/login/formateur`

2. **Tapez** l'email `timmydarcy44@gmail.com` (laissez le champ mot de passe vide pour l'instant)

3. **Cliquez** "Mot de passe oublié ?" → vous recevez un mail

4. **Cliquez** le lien → vous passez par `/auth/callback?next=/create-password` → vous arrivez sur `/create-password`

5. **Définissez** un nouveau mot de passe → vous êtes redirigé vers `/formateur`

6. **Revenez** sur `/login/formateur` → email + nouveau mot de passe → ça passe (plus d'"Invalid login credentials")

## 🔧 Fichiers corrigés

- ✅ `app/login/formateur/page.tsx` - Code simplifié avec bouton "Mot de passe oublié ?"
- ✅ `app/auth/callback/route.ts` - Gestion correcte des cookies et redirection
- ✅ `app/create-password/page.tsx` - Définition du mot de passe et redirection vers `/formateur`

## 🎯 Test immédiat

Le système est maintenant prêt ! Vous pouvez tester le flux complet avec `timmydarcy44@gmail.com`.
