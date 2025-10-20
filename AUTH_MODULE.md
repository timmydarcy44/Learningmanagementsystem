# Module d'Authentification LMS

## 🎯 Vue d'ensemble

Module d'authentification complet pour une plateforme LMS avec gestion des rôles et redirection automatique.

## 👥 Rôles et Méthodes de Connexion

### Admin
- **Méthodes** : Email + Mot de passe ou Google OAuth
- **Page de connexion** : `/login/admin`
- **Redirection** : `/admin`
- **Fonctionnalités** : Gestion complète de la plateforme

### Formateur (Instructor)
- **Méthodes** : Email + Mot de passe
- **Page de connexion** : `/login/formateur`
- **Redirection** : `/formateur`
- **Fonctionnalités** : Création et gestion des formations

### Tuteur (Tutor)
- **Méthodes** : Lien magique par email
- **Page de connexion** : `/login/tuteur`
- **Redirection** : `/tuteur`
- **Fonctionnalités** : Accompagnement des apprenants

### Apprenant (Learner)
- **Méthodes** : Lien magique par email
- **Page de connexion** : `/login/apprenant`
- **Redirection** : `/apprenant`
- **Fonctionnalités** : Suivi des formations

## 🏗️ Architecture

### Structure des fichiers

```
app/
├── (dashboard)/
│   ├── admin/
│   │   ├── layout.tsx      # Protection SSR admin
│   │   └── page.tsx        # Dashboard admin
│   ├── formateur/
│   │   ├── layout.tsx      # Protection SSR formateur
│   │   └── page.tsx        # Dashboard formateur
│   ├── tuteur/
│   │   ├── layout.tsx      # Protection SSR tuteur
│   │   └── page.tsx        # Dashboard tuteur
│   └── apprenant/
│       ├── layout.tsx      # Protection SSR apprenant
│       └── page.tsx        # Dashboard apprenant
├── auth/
│   ├── callback/
│   │   └── route.ts        # Gestion des callbacks OAuth/magic link
│   └── signout/
│       └── route.ts        # Déconnexion
├── login/
│   ├── page.tsx            # Sélection de rôle
│   ├── admin/
│   │   └── page.tsx        # Login admin (email+password + Google)
│   ├── formateur/
│   │   └── page.tsx        # Login formateur (email+password)
│   ├── tuteur/
│   │   └── page.tsx        # Login tuteur (magic link)
│   └── apprenant/
│       └── page.tsx        # Login apprenant (magic link)
└── page.tsx                # Redirection vers /login

lib/
└── getUserRole.ts           # Helper pour récupérer le rôle utilisateur
```

## 🔧 Configuration Supabase

### Variables d'environnement requises

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Tables de base de données

#### `org_memberships`
```sql
CREATE TABLE org_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'instructor', 'tutor', 'learner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  has_password BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Utilisation

### 1. Sélection de rôle
L'utilisateur accède à `/login` et choisit son rôle.

### 2. Connexion
- **Admin** : Email + mot de passe ou Google OAuth
- **Formateur** : Email + mot de passe
- **Tuteur/Apprenant** : Lien magique par email

### 3. Redirection automatique
Après authentification, l'utilisateur est automatiquement redirigé vers son dashboard selon son rôle.

### 4. Protection des routes
Chaque dashboard est protégé par un layout SSR qui vérifie :
- L'authentification de l'utilisateur
- Le rôle approprié

## 🎨 Design

### Thème
- **Couleur dominante** : `#252525`
- **Typographie** : SF Pro Display / SF Pro Text
- **Style** : Apple/Nike (épuré, contrasté, moderne, élégant)
- **Effets** : Glassmorphism léger, transitions fluides

### Composants UI
- Boutons arrondis avec ombres douces
- Cartes avec effet glassmorphism
- Animations Framer Motion
- Responsive design

## 🔐 Sécurité

### Protection SSR
- Vérification du rôle côté serveur
- Redirection automatique si non autorisé
- Gestion des sessions Supabase

### Authentification
- Sessions persistantes avec cookies sécurisés
- Support OAuth (Google)
- Liens magiques sécurisés
- Déconnexion propre

## 📱 Responsive

Toutes les pages sont optimisées pour :
- Desktop
- Tablet
- Mobile

## 🛠️ Développement

### Commandes utiles

```bash
# Démarrer le serveur de développement
npm run dev

# Vérifier les erreurs de linting
npm run lint

# Build de production
npm run build
```

### Debug

Pour déboguer l'authentification, vous pouvez :
1. Vérifier les cookies dans les DevTools
2. Consulter les logs Supabase
3. Utiliser la page `/debug-user` (si créée)

## 🔄 Workflow complet

1. **Utilisateur** → `/login` (sélection de rôle)
2. **Connexion** → Méthode appropriée selon le rôle
3. **Callback** → `/auth/callback` (échange du code)
4. **Vérification** → Rôle récupéré depuis `org_memberships`
5. **Redirection** → Dashboard approprié
6. **Protection** → Layout SSR vérifie l'accès

## 📝 Notes importantes

- Les utilisateurs doivent avoir un enregistrement dans `org_memberships` avec le bon rôle
- Les liens magiques nécessitent une configuration email dans Supabase
- Google OAuth nécessite une configuration OAuth dans Supabase
- Tous les layouts protègent leurs routes respectives
