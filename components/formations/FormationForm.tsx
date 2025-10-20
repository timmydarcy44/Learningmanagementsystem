'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import UploadButton from '@/components/ui/UploadButton';
import { VisibilityMode } from '@/types/db';

interface FormationFormProps {
  orgId: string;
}

const FormationForm: React.FC<FormationFormProps> = ({ orgId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility_mode: 'both' as VisibilityMode,
    cover_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const supabase = supabaseBrowser();
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Insert formation
      const { data, error } = await supabase
        .from('formations')
        .insert({
          title: formData.title,
          description: formData.description || null,
          visibility_mode: formData.visibility_mode,
          cover_url: formData.cover_url || null,
          org_id: orgId,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Redirect to editor
      router.push(`/app/formations/${data.id}`);
    } catch (error: any) {
      console.error('Formation creation error:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCoverUpload = ({ url, path }: { url: string; path: string }) => {
    setFormData(prev => ({ ...prev, cover_url: url }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">
            Créer une formation
          </h1>
          <p className="text-neutral-400">
            Remplissez les informations de base de votre nouvelle formation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Titre *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-neutral-100 placeholder-neutral-500 focus:border-iris-500 focus:outline-none"
              placeholder="Titre de votre formation"
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-neutral-100 placeholder-neutral-500 focus:border-iris-500 focus:outline-none resize-none"
              placeholder="Description de votre formation..."
            />
          </div>

          {/* Visibility Mode */}
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-3">
              Visibilité
            </label>
            <div className="space-y-3">
              {([
                { value: 'catalog_only', label: 'Catalogue uniquement', desc: 'Visible dans le catalogue' },
                { value: 'pathway_only', label: 'Parcours uniquement', desc: 'Visible dans les parcours' },
                { value: 'both', label: 'Les deux', desc: 'Visible partout' },
              ] as const).map((option) => (
                <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility_mode"
                    value={option.value}
                    checked={formData.visibility_mode === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, visibility_mode: e.target.value as VisibilityMode }))}
                    className="mt-1 w-4 h-4 text-iris-500 bg-white/5 border-white/10 focus:ring-iris-500 focus:ring-2"
                  />
                  <div>
                    <div className="text-neutral-100 font-medium">{option.label}</div>
                    <div className="text-sm text-neutral-400">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cover Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Couverture
            </label>
            <div className="space-y-4">
              <UploadButton
                prefix={`org_${orgId}/covers`}
                accept="image/*"
                onUploaded={handleCoverUpload}
              >
                Télécharger une couverture
              </UploadButton>
              
              {formData.cover_url && (
                <div className="mt-4">
                  <img
                    src={formData.cover_url}
                    alt="Couverture"
                    className="w-full max-w-md h-48 object-cover rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || !formData.title.trim()}
              className="px-8"
            >
              {loading ? 'Création...' : 'Créer la formation'}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-red-300">{errors.submit}</p>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default FormationForm;
