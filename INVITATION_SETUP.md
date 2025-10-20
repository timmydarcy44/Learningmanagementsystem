# Configuration des Server Actions d'Invitation

## Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env.local` :

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Fonctionnalités implémentées

### 1. Invitation Admin (`/admin/utilisateurs`)

**Server Action :** `inviteUserAction`

**Rôles supportés :**
- `instructor` (Formateur) → Envoie une invitation par email avec définition de mot de passe
- `tutor` (Tuteur) → Génère un magic link à copier/envoyer
- `learner` (Apprenant) → Génère un magic link à copier/envoyer

**Workflow :**
1. Crée ou récupère l'utilisateur dans Supabase Auth
2. Ajoute le membership dans `org_memberships`
3. Envoie invitation (formateur) ou génère magic link (tuteur/apprenant)

### 2. Invitation Formateur (`/formateur/utilisateurs`)

**Server Action :** `inviteLearnerAction`

**Rôles supportés :**
- `learner` (Apprenant) uniquement

**Workflow :**
1. Vérifie que l'utilisateur actuel est un formateur
2. Crée ou récupère l'apprenant
3. Ajoute le membership comme apprenant
4. Génère un magic link

## Intégration Email (Optionnelle)

Pour automatiser l'envoi des magic links, vous pouvez intégrer :

- **Resend** : `npm install resend`
- **SendGrid** : `npm install @sendgrid/mail`
- **Nodemailer** : `npm install nodemailer`

Exemple avec Resend :

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Dans votre Server Action
await resend.emails.send({
  from: 'noreply@votre-domaine.com',
  to: email,
  subject: 'Invitation à rejoindre notre LMS',
  html: `<p>Cliquez sur ce lien pour vous connecter : <a href="${magicLink}">Se connecter</a></p>`
});
```

## Sécurité

- ✅ Vérification des rôles côté serveur
- ✅ Utilisation de la SERVICE_ROLE_KEY pour les opérations admin
- ✅ Validation des données d'entrée
- ✅ Gestion des erreurs

## Prochaines étapes

1. Configurez vos variables d'environnement Supabase
2. Testez les invitations depuis `/admin/utilisateurs`
3. Testez les invitations d'apprenants depuis `/formateur/utilisateurs`
4. Intégrez un provider d'email si souhaité
