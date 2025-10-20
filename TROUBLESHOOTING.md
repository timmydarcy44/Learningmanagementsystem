# 🔧 Guide de dépannage - "Invalid Login Credentials"

## 🚨 Problème : "Invalid login credentials"

Cette erreur peut avoir plusieurs causes. Voici comment la résoudre :

## 🔍 Étapes de diagnostic

### 1. Vérifier la configuration Supabase
```bash
# Vérifier les variables d'environnement
curl http://localhost:3000/api/env-check
```

### 2. Tester la connexion Supabase
- Allez sur `/test-auth` pour tester côté client
- Allez sur `/test-server-auth` pour tester côté serveur

### 3. Créer un utilisateur de test
Sur `/test-auth` :
1. Entrez un email (ex: `admin@test.com`)
2. Entrez un mot de passe (ex: `password123`)
3. Cliquez sur "Créer compte"
4. Vérifiez votre email et confirmez le compte
5. Essayez de vous connecter

## 🛠️ Solutions possibles

### Solution 1 : Utilisateur n'existe pas
**Problème :** L'utilisateur n'a pas encore été créé
**Solution :**
1. Utilisez le flux "Mot de passe oublié" sur `/login/admin` ou `/login/formateur`
2. Ou créez un compte via `/test-auth`

### Solution 2 : Email non confirmé
**Problème :** L'utilisateur existe mais l'email n'est pas confirmé
**Solution :**
1. Vérifiez votre boîte email
2. Cliquez sur le lien de confirmation
3. Ou utilisez le flux "Mot de passe oublié"

### Solution 3 : Mot de passe incorrect
**Problème :** Le mot de passe saisi ne correspond pas
**Solution :**
1. Utilisez le flux "Mot de passe oublié"
2. Ou réinitialisez le mot de passe via Supabase Dashboard

### Solution 4 : Configuration Supabase
**Problème :** Problème de configuration Supabase
**Solution :**
1. Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` est correct
2. Vérifiez que `NEXT_PUBLIC_SUPABASE_ANON_KEY` est correct
3. Vérifiez que les URLs de redirection sont configurées dans Supabase

## 🔄 Flux recommandé pour créer un utilisateur

### Pour Admin/Formateur :
1. Allez sur `/login/admin` ou `/login/formateur`
2. Cliquez sur "Mot de passe oublié ?"
3. Entrez votre email
4. Cliquez sur le lien dans l'email reçu
5. Définissez votre mot de passe sur `/create-password`
6. Vous serez redirigé vers le bon dashboard

### Pour Tuteur/Apprenant :
1. Allez sur `/login/tuteur` ou `/login/apprenant`
2. Entrez votre email
3. Cliquez sur le lien dans l'email reçu
4. Vous serez redirigé vers le bon dashboard

## 🧪 Tests à effectuer

### Test 1 : Création d'utilisateur
```bash
# Allez sur http://localhost:3000/test-auth
# Créez un compte avec admin@test.com / password123
# Vérifiez que l'email de confirmation arrive
```

### Test 2 : Connexion
```bash
# Après confirmation de l'email
# Essayez de vous connecter avec admin@test.com / password123
# Vérifiez que la connexion fonctionne
```

### Test 3 : Flux "Mot de passe oublié"
```bash
# Allez sur http://localhost:3000/login/admin
# Cliquez sur "Mot de passe oublié ?"
# Entrez admin@test.com
# Vérifiez que l'email arrive
# Cliquez sur le lien et définissez un nouveau mot de passe
```

## 🔧 Configuration Supabase Dashboard

Vérifiez que dans votre Supabase Dashboard :

1. **Authentication > Settings > Site URL** : `http://localhost:3000`
2. **Authentication > Settings > Redirect URLs** :
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/callback?next=/create-password`

3. **Authentication > Providers** :
   - Email : Activé
   - Google : Activé (pour admin)

## 📝 Messages d'erreur améliorés

Les pages de login affichent maintenant des messages d'erreur plus clairs :
- "Email ou mot de passe incorrect" pour les identifiants invalides
- "Veuillez confirmer votre email avant de vous connecter" pour les emails non confirmés
- "Trop de tentatives. Veuillez patienter avant de réessayer" pour le rate limiting

## 🆘 Si le problème persiste

1. **Vérifiez les logs** dans la console du navigateur
2. **Vérifiez les logs** du serveur Next.js
3. **Testez avec un nouvel email** sur `/test-auth`
4. **Vérifiez la configuration** Supabase Dashboard
5. **Redémarrez** le serveur Next.js

## 📞 Support

Si le problème persiste après ces étapes :
1. Vérifiez que Supabase est accessible
2. Vérifiez que les variables d'environnement sont correctes
3. Testez avec un compte créé directement dans Supabase Dashboard
