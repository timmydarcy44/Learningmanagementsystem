'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image, FileText, Video } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/client';

interface UploaderProps {
  orgId: string;
  formationId?: string;
  folder: string;
  visibility: 'private' | 'catalog_only' | 'public';
  onUploaded: (objectName: string, url: string) => void;
  accept?: string;
  maxSize?: number; // MB
}

export default function Uploader({ 
  orgId, 
  formationId, 
  folder, 
  visibility, 
  onUploaded, 
  accept = "image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.md",
  maxSize = 10 
}: UploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const supabase = supabaseBrowser();
      
      // 1. Générer un nom de fichier unique
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExtension}`;
      const objectName = `org_${orgId}/formations/${formationId || 'temp'}/${folder}/${fileName}`;
      
      // 2. Upload vers Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('lms-assets')
        .upload(objectName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 3. Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('lms-assets')
        .getPublicUrl(objectName);

      // 4. Créer l'entrée dans la table assets
      console.log('[TRACE] about to insert asset via Uploader', { objectName, orgId, formationId, visibility });
      
      const { error: assetError } = await supabase
        .from('assets')
        .insert({
          object_name: objectName,
          filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          visibility_mode: visibility,
          org_id: orgId,
          formation_id: formationId || null,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (assetError) {
        console.error('[ERROR] insert assets failed in Uploader:', assetError);
        console.warn('Failed to create asset entry:', assetError);
        // Continue anyway, the file is uploaded
      } else {
        console.log('[TRACE] asset created successfully via Uploader');
      }
      
      // 5. Notifier le parent
      onUploaded(objectName, publicUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload: ' + (error as Error).message);
    } finally {
      setUploading(false);
      setPreview(null);
    }
  }, [orgId, formationId, folder, visibility, onUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, type) => {
      acc[type.trim()] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxSize * 1024 * 1024,
    multiple: false
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    return FileText;
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-iris-500 bg-iris-500/10' 
            : 'border-white/20 hover:border-white/40'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-3">
          <Upload className="h-8 w-8 text-white/50 mx-auto" />
          <div>
            <p className="text-white font-medium">
              {isDragActive ? 'Déposez le fichier ici' : 'Glissez-déposez un fichier'}
            </p>
            <p className="text-sm text-white/50 mt-1">
              ou cliquez pour sélectionner
            </p>
          </div>
          <p className="text-xs text-white/40">
            {accept} • Max {maxSize}MB
          </p>
        </div>
      </div>

      {preview && (
        <div className="relative">
          <div className="glass p-4 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Image className="h-5 w-5 text-white/70" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white font-medium">Upload en cours...</p>
              <p className="text-xs text-white/50">Veuillez patienter</p>
            </div>
            {uploading && (
              <div className="animate-spin h-4 w-4 border-2 border-iris-500 border-t-transparent rounded-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}