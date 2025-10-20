# Architecture des Espaces Utilisateurs - LMS

## 🎯 Vue d'ensemble

Le LMS utilise un système de rôles avec des espaces dédiés pour chaque type d'utilisateur :

### 📋 Rôles disponibles
- **`admin`** : Accès complet (admin + formations)
- **`instructor`** : Création et gestion des formations
- **`learner`** : Accès aux formations assignées
- **`tutor`** : Suivi et accompagnement des apprenants

## 🏗️ Structure des espaces

### `/app/formations` - Espace Formateur/Admin
- **Accès** : `admin`, `instructor`
- **Fonctionnalités** : Création, édition, gestion des formations
- **Layout** : `app/app/layout.tsx` (protection admin/instructor)

### `/app/learning` - Espace Apprenant
- **Accès** : `learner` uniquement
- **Fonctionnalités** : Parcours d'apprentissage, ressources
- **Layout** : `app/app/learning/layout.tsx` (protection learner)

### `/app/tutor` - Espace Tuteur
- **Accès** : `tutor` uniquement
- **Fonctionnalités** : Suivi apprenants, évaluations
- **Layout** : `app/app/tutor/layout.tsx` (protection tutor)

### `/app/admin` - Espace Administration
- **Accès** : `admin` uniquement
- **Fonctionnalités** : Gestion membres, rôles, organisations
- **Layout** : `app/app/admin/layout.tsx` (protection admin)

### `/app/formateur` - Alias
- **Redirection** : `/app/formations`
- **Utilité** : URL plus intuitive pour les formateurs

## 🔐 Protection des routes

Chaque espace est protégé par :
1. **Vérification d'authentification** : Utilisateur connecté
2. **Vérification d'organisation** : Membership dans une org
3. **Vérification de rôle** : Rôle approprié pour l'espace

## 🚀 Redirection automatique

La page racine (`/`) redirige automatiquement selon le rôle :
- `admin`/`instructor` → `/app/formations`
- `learner` → `/app/learning`
- `tutor` → `/app/tutor`

## 🛠️ Outils de debug

### `/debug-auth` - Debug d'authentification
Affiche les informations de session et de membership pour diagnostiquer les problèmes d'auth.

## 📁 Fichiers clés

```
app/
├── page.tsx                    # Redirection par rôle
├── login/page.tsx              # Authentification multi-méthodes
├── create-password/page.tsx    # Création mot de passe
├── debug-auth/page.tsx         # Debug auth
└── app/
    ├── layout.tsx              # Layout formations (admin/instructor)
    ├── formations/page.tsx     # Gestion formations
    ├── formateur/page.tsx     # Alias vers formations
    ├── learning/
    │   ├── layout.tsx         # Layout apprenant
    │   └── page.tsx           # Espace apprenant
    ├── tutor/
    │   ├── layout.tsx         # Layout tuteur
    │   └── page.tsx           # Espace tuteur
    └── admin/
        ├── layout.tsx         # Layout admin
        └── page.tsx           # Espace admin
```

## 🔧 Configuration Supabase

Exécuter le script `supabase-init.sql` pour créer :
- Tables : `organizations`, `org_memberships`, `formations`, etc.
- Politiques RLS pour la sécurité
- Données de test

## 🎨 Design

Tous les espaces utilisent le thème dark premium (#252525) avec :
- Glassmorphism (`glass` class)
- Gradients iris/blush
- Animations Framer Motion
- Interface responsive
