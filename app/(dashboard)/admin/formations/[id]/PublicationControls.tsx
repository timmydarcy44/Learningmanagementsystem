'use client';

import { useState, useTransition } from 'react';
import { Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { saveAsDraft, publishFormation } from './actions';

interface PublicationControlsProps {
  formationId: string;
  published: boolean;
}

export default function PublicationControls({ formationId, published }: PublicationControlsProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'draft' | 'published'>(published ? 'published' : 'draft');

  const handleSaveAsDraft = () => {
    startTransition(async () => {
      try {
        const result = await saveAsDraft(formationId);
        if (result.ok) {
          setStatus('draft');
        }
      } catch (error) {
        console.error('Error saving as draft:', error);
      }
    });
  };

  const handlePublish = () => {
    startTransition(async () => {
      try {
        const result = await publishFormation(formationId);
        if (result.ok) {
          setStatus('published');
        }
      } catch (error) {
        console.error('Error publishing:', error);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        {status === 'published' ? (
          <>
            <Eye className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">Publiée</span>
          </>
        ) : (
          <>
            <EyeOff className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-400 font-medium">Brouillon</span>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSaveAsDraft}
          disabled={isPending || status === 'draft'}
          className={`btn-secondary flex items-center gap-2 ${
            status === 'draft' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Enregistrer
        </button>

        <button
          onClick={handlePublish}
          disabled={isPending || status === 'published'}
          className={`btn-cta flex items-center gap-2 ${
            status === 'published' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          Publier
        </button>
      </div>
    </div>
  );
}
