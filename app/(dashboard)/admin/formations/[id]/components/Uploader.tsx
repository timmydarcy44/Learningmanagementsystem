'use client';

import { useState, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { Upload, Image as ImageIcon, Video, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface UploaderProps {
  onImageUpload: (url: string) => void;
  onVideoUpload: (url: string, title?: string) => void;
  formationId: string;
  orgId: string;
  published: boolean;
}

export default function Uploader({ onImageUpload, onVideoUpload, formationId, orgId, published }: UploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  const uploadFile = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const sb = supabaseBrowser();
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `formations/${formationId}/${fileName}`;

      // Upload vers Supabase Storage
      const { data, error } = await sb.storage
        .from('lms-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Obtenir l'URL publique ou signée selon le statut de publication
      let publicUrl: string;
      if (published) {
        const { data: publicData } = sb.storage
          .from('lms-assets')
          .getPublicUrl(filePath);
        publicUrl = publicData.publicUrl;
      } else {
        const { data: signedData } = await sb.storage
          .from('lms-assets')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 an
        publicUrl = signedData.signedUrl;
      }

      // Enregistrer dans la table assets
      const { error: assetError } = await sb.from('assets').insert({
        object_name: filePath,
        formation_id: formationId,
        org_id: orgId,
        visibility: published ? 'public' : 'private',
        file_type: file.type,
        file_size: file.size,
      });

      if (assetError) {
        console.error('Asset record error:', assetError);
        // Ne pas faire échouer l'upload pour cette erreur
      }

      return publicUrl;
    } catch (error: any) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [formationId, orgId, published]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image valide');
      return;
    }

    try {
      const url = await uploadFile(file);
      if (url) {
        onImageUpload(url);
        toast.success('Image uploadée avec succès !');
      } else {
        toast.error('Erreur lors de l\'upload de l\'image');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'upload de l\'image');
    }
  }, [uploadFile, onImageUpload]);

  const handleVideoSubmit = useCallback(() => {
    if (!videoUrl.trim()) {
      toast.error('Veuillez entrer une URL de vidéo');
      return;
    }

    // Vérifier si c'est une URL YouTube
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    if (!youtubeRegex.test(videoUrl)) {
      toast.error('Veuillez entrer une URL YouTube valide');
      return;
    }

    onVideoUpload(videoUrl, videoTitle || undefined);
    setShowVideoForm(false);
    setVideoUrl('');
    setVideoTitle('');
    toast.success('Vidéo ajoutée avec succès !');
  }, [videoUrl, videoTitle, onVideoUpload]);

  return (
    <div className="space-y-4">
      {/* Upload d'image */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors">
          <ImageIcon className="w-4 h-4" />
          <span className="text-sm">Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
        {isUploading && <Loader2 className="w-4 h-4 animate-spin text-white/70" />}
      </div>

      {/* Ajout de vidéo */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowVideoForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Video className="w-4 h-4" />
          <span className="text-sm">Vidéo YouTube</span>
        </button>
      </div>

      {/* Formulaire vidéo */}
      {showVideoForm && (
        <div className="glass-sm p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white/90">Ajouter une vidéo YouTube</h4>
            <button
              onClick={() => setShowVideoForm(false)}
              className="p-1 hover:bg-white/10 rounded"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>
          
          <div>
            <label className="block text-xs text-white/70 mb-1">URL YouTube</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-iris-500"
            />
          </div>
          
          <div>
            <label className="block text-xs text-white/70 mb-1">Titre (optionnel)</label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Titre de la vidéo"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-iris-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleVideoSubmit}
              className="flex-1 px-3 py-2 bg-iris-500 hover:bg-iris-600 text-white rounded-md text-sm transition-colors"
            >
              Ajouter
            </button>
            <button
              onClick={() => setShowVideoForm(false)}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
