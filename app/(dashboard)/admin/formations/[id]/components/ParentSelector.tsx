'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface ParentSelectorProps {
  type: 'chapter' | 'subchapter';
  sections: Array<{ id: string; title: string; }>;
  chapters: Array<{ id: string; title: string; section_id: string; }>;
  onSelect: (parentId: string) => void;
  onCancel: () => void;
}

export default function ParentSelector({ type, sections, chapters, onSelect, onCancel }: ParentSelectorProps) {
  const [selectedParent, setSelectedParent] = useState<string>('');

  const handleConfirm = () => {
    if (selectedParent) {
      onSelect(selectedParent);
    }
  };

  const availableParents = type === 'chapter' 
    ? sections.map(section => ({ id: section.id, title: section.title, type: 'section' as const }))
    : chapters.map(chapter => ({ id: chapter.id, title: chapter.title, type: 'chapter' as const }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-white mb-4">
          Sélectionner le parent pour le {type === 'chapter' ? 'chapitre' : 'sous-chapitre'}
        </h3>
        
        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
          {availableParents.length === 0 ? (
            <p className="text-white/50 text-center py-4">
              {type === 'chapter' 
                ? 'Aucune section disponible. Créez d\'abord une section.' 
                : 'Aucun chapitre disponible. Créez d\'abord un chapitre.'}
            </p>
          ) : (
            availableParents.map((parent) => (
              <button
                key={parent.id}
                onClick={() => setSelectedParent(parent.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedParent === parent.id
                    ? 'bg-iris-500/20 text-iris-400 border border-iris-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-white/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{parent.title}</span>
                  {selectedParent === parent.id && (
                    <Check size={18} className="text-iris-400" />
                  )}
                </div>
                <div className="text-sm text-white/50 mt-1">
                  {parent.type === 'section' ? 'Section' : 'Chapitre'}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedParent}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-iris-500 to-purple-500 hover:from-iris-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}