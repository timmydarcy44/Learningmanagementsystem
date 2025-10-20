'use client';

import React, { useState, useRef } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface UploadButtonProps {
  prefix: string;
  accept: string;
  onUploaded: (data: { url: string; path: string }) => void;
  className?: string;
  children?: React.ReactNode;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  prefix,
  accept,
  onUploaded,
  className,
  children = 'Télécharger',
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const supabase = supabaseBrowser();
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${prefix}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('lms-assets')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('lms-assets')
        .getPublicUrl(filePath);

      onUploaded({
        url: urlData.publicUrl,
        path: filePath,
      });
    } catch (error) {
      console.error('Upload error:', error);
      // You might want to show a toast here
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={cn(className)}
      >
        {uploading ? 'Téléchargement...' : children}
      </Button>
    </>
  );
};

export default UploadButton;
