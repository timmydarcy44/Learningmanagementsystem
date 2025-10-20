'use client';

import { useState } from 'react';
import { Plus, Copy, Mail } from 'lucide-react';

interface InvitationFormProps {
  onSubmit: (formData: FormData) => Promise<{ ok: boolean; message?: string; magicLink?: string; error?: string }>;
  title: string;
  description: string;
  showRoleSelect?: boolean;
  defaultRole?: string;
}

export default function InvitationForm({ 
  onSubmit, 
  title, 
  description, 
  showRoleSelect = false,
  defaultRole = ''
}: InvitationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message?: string; magicLink?: string; error?: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setResult(null);
    
    try {
      const response = await onSubmit(formData);
      setResult(response);
    } catch (error) {
      setResult({ ok: false, error: 'Erreur lors de l\'invitation' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <Plus className="h-5 w-5 text-iris-400" />
        {title}
      </h3>
      <p className="text-white/70 text-sm mb-4">{description}</p>

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email *
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
              placeholder="exemple@email.com"
            />
          </div>

          {/* Rôle (optionnel) */}
          {showRoleSelect && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Rôle *
              </label>
              <select
                name="role"
                required
                defaultValue={defaultRole}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
              >
                <option value="">Sélectionner un rôle</option>
                <option value="instructor">Formateur</option>
                <option value="tutor">Tuteur</option>
                <option value="learner">Apprenant</option>
              </select>
            </div>
          )}
        </div>

        {/* Org ID caché pour les admins */}
        {showRoleSelect && (
          <input type="hidden" name="org_id" value="default-org" />
        )}

        {/* Bouton d'envoi */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-cta disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
        </button>
      </form>

      {/* Résultat */}
      {result && (
        <div className={`mt-4 p-4 rounded-xl ${
          result.ok 
            ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
            : 'bg-red-500/20 border border-red-500/30 text-red-300'
        }`}>
          {result.ok ? (
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {result.message || 'Invitation envoyée avec succès !'}
              </p>
              
              {result.magicLink && (
                <div className="space-y-2">
                  <p className="text-sm">Magic link généré :</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={result.magicLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white/80"
                    />
                    <button
                      onClick={() => copyToClipboard(result.magicLink!)}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      {copiedLink ? 'Copié!' : 'Copier'}
                    </button>
                  </div>
                  <p className="text-xs opacity-70">
                    Envoyez ce lien à l'utilisateur ou intégrez-le dans votre système d'email.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="flex items-center gap-2">
              <span className="text-red-400">❌</span>
              {result.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
