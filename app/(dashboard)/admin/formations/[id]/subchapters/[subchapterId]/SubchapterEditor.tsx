'use client';

import { useState } from 'react';
import { ArrowLeft, Settings, Sparkles, FileText, Upload } from 'lucide-react';
import { saveRichContent } from '../../actions';
import RichEditor from '@/components/admin/RichEditor';
import PropertiesSheet from '@/components/admin/PropertiesSheet';

interface SubchapterEditorProps {
  formationId: string;
  orgId: string;
  subchapterId: string;
  subchapterTitle: string;
  chapterTitle: string;
  sectionTitle: string;
  readingMode: 'free' | 'linear';
  isPublished: boolean;
  initialContent?: any;
  initialPlainText?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function SubchapterEditor({
  formationId,
  orgId,
  subchapterId,
  subchapterTitle,
  chapterTitle,
  sectionTitle,
  readingMode,
  isPublished,
  initialContent,
  initialPlainText,
  createdAt,
  updatedAt,
}: SubchapterEditorProps) {
  const [showProperties, setShowProperties] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiFile, setAiFile] = useState<File | null>(null);
  const [aiTab, setAiTab] = useState<'prompt' | 'file'>('prompt');

  const handleSave = async (content: any, plainText: string) => {
    try {
      await saveRichContent({
        formationId,
        orgId,
        subchapterId,
        editor: content,
        plainText,
      });
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleAIGenerate = async () => {
    if (aiTab === 'prompt' && !aiPrompt.trim()) return;
    if (aiTab === 'file' && !aiFile) return;

    // Placeholder pour l'IA - à implémenter avec votre service d'IA
    const generatedContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: aiTab === 'prompt' 
                ? `Contenu généré à partir du prompt: "${aiPrompt}"`
                : `Contenu extrait du fichier: ${aiFile?.name}`,
            },
          ],
        },
      ],
    };

    // Insérer le contenu dans l'éditeur
    console.log('Generated content:', generatedContent);
    
    setShowAI(false);
    setAiPrompt('');
    setAiFile(null);
  };

  return (
    <div className="min-h-screen bg-[#252525] text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#252525]/70 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a
              href={`/admin/formations/${formationId}`}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </a>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-white/70">{sectionTitle}</div>
              <div className="text-white/50">/</div>
              <div className="text-sm text-white/70">{chapterTitle}</div>
              <div className="text-white/50">/</div>
              <div className="font-semibold text-white">{subchapterTitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAI(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white font-medium rounded-xl transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Créer avec l'IA
            </button>
            
            <button
              onClick={() => setShowProperties(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
            >
              <Settings className="h-4 w-4" />
              Propriétés
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        <RichEditor
          initialContent={initialContent}
          onSave={handleSave}
          orgId={orgId}
          formationId={formationId}
          isPublished={isPublished}
          onAIClick={() => setShowAI(true)}
        />
      </main>

      {/* AI Modal */}
      {showAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAI(false)} />
          <div className="relative w-full max-w-2xl bg-[#252525] border border-white/10 rounded-2xl shadow-elev-3">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  Créer avec l'IA
                </h2>
                <button
                  onClick={() => setShowAI(false)}
                  className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                >
                  <span className="text-white/70">×</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setAiTab('prompt')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    aiTab === 'prompt'
                      ? 'bg-iris-500 text-white'
                      : 'bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <FileText className="h-4 w-4 inline mr-2" />
                  Prompt libre
                </button>
                <button
                  onClick={() => setAiTab('file')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    aiTab === 'file'
                      ? 'bg-iris-500 text-white'
                      : 'bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  Upload fichier
                </button>
              </div>

              {/* Content */}
              {aiTab === 'prompt' ? (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white">
                    Décrivez le contenu que vous souhaitez générer
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ex: Créez un cours sur les bases du JavaScript avec des exemples pratiques..."
                    className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white">
                    Uploader un fichier (PDF, DOCX, Markdown)
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                    <input
                      type="file"
                      accept=".pdf,.docx,.md,.txt"
                      onChange={(e) => setAiFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="ai-file-upload"
                    />
                    <label
                      htmlFor="ai-file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-white/50" />
                      <span className="text-white/70">Cliquez pour uploader</span>
                      {aiFile && (
                        <span className="text-iris-400 text-sm">{aiFile.name}</span>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={() => setShowAI(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAIGenerate}
                  disabled={
                    (aiTab === 'prompt' && !aiPrompt.trim()) ||
                    (aiTab === 'file' && !aiFile)
                  }
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  Générer le contenu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Properties Sheet */}
      <PropertiesSheet
        isOpen={showProperties}
        onClose={() => setShowProperties(false)}
        orgId={orgId}
        formationId={formationId}
        subchapterId={subchapterId}
        readingMode={readingMode}
        published={isPublished}
      />
    </div>
  );
}
