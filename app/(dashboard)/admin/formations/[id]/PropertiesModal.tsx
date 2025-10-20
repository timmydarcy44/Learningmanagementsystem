'use client';

import { useState } from 'react';
import { X, Save, Users, Settings } from 'lucide-react';
import { updateFormationReadingMode } from './actions';
import AssignmentsPanel from './AssignmentsPanel';

type Formation = { 
  id: string; 
  org_id: string; 
  title: string; 
  reading_mode: 'free' | 'linear'; 
  visibility_mode: 'private' | 'catalog_only' | 'public'; 
  published: boolean 
};

interface PropertiesModalProps {
  formation: Formation;
  formationId: string;
  orgId: string;
  onClose: () => void;
}

export default function PropertiesModal({ formation, formationId, orgId, onClose }: PropertiesModalProps) {
  const [readingMode, setReadingMode] = useState(formation.reading_mode);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveReadingMode = async () => {
    setIsSaving(true);
    try {
      await updateFormationReadingMode(formationId, readingMode);
      // Optionnel: toast de succès
    } catch (error) {
      console.error('Error updating reading mode:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Settings size={24} className="text-iris-400" />
            <h2 className="text-xl font-semibold text-white">Propriétés de la formation</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-white/70" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne gauche - Propriétés */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings size={18} />
                  Configuration
                </h3>
                
                {/* Mode de lecture */}
                <div className="glass rounded-xl p-4">
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Mode de lecture
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="readingMode"
                        value="free"
                        checked={readingMode === 'free'}
                        onChange={(e) => setReadingMode(e.target.value as 'free' | 'linear')}
                        className="w-4 h-4 text-iris-400 bg-gray-700 border-gray-600 focus:ring-iris-400"
                      />
                      <div>
                        <div className="text-white font-medium">Libre</div>
                        <div className="text-white/60 text-sm">Les apprenants peuvent naviguer librement</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="readingMode"
                        value="linear"
                        checked={readingMode === 'linear'}
                        onChange={(e) => setReadingMode(e.target.value as 'free' | 'linear')}
                        className="w-4 h-4 text-iris-400 bg-gray-700 border-gray-600 focus:ring-iris-400"
                      />
                      <div>
                        <div className="text-white font-medium">Linéaire</div>
                        <div className="text-white/60 text-sm">Les apprenants doivent suivre l'ordre</div>
                      </div>
                    </label>
                  </div>
                  
                  <button
                    onClick={handleSaveReadingMode}
                    disabled={isSaving || readingMode === formation.reading_mode}
                    className="mt-4 btn-cta-sm flex items-center gap-2"
                  >
                    <Save size={16} />
                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>

                {/* Informations générales */}
                <div className="glass rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3">Informations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Titre:</span>
                      <span className="text-white">{formation.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Visibilité:</span>
                      <span className="text-white capitalize">{formation.visibility_mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Statut:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        formation.published 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {formation.published ? 'Publiée' : 'Brouillon'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Assignations */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users size={18} />
                Assignations
              </h3>
              <AssignmentsPanel formationId={formationId} orgId={orgId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
