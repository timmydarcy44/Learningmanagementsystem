'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Palette, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Save,
  Sparkles
} from 'lucide-react';
import Uploader from './Uploader';

interface RichEditorProps {
  initialContent?: any;
  onSave: (content: any, plainText: string) => void;
  orgId: string;
  formationId: string;
  isPublished: boolean;
  onAIClick: () => void;
}

export default function RichEditor({ 
  initialContent, 
  onSave, 
  orgId, 
  formationId, 
  isPublished,
  onAIClick 
}: RichEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-iris-400 underline hover:text-iris-300',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content: initialContent || '',
    onUpdate: ({ editor }) => {
      // Debounced save
      debouncedSave(editor.getJSON(), editor.getText());
    },
  });

  const debouncedSave = useCallback(
    debounce((content: any, plainText: string) => {
      setIsSaving(true);
      onSave(content, plainText);
      setLastSaved(new Date());
      setTimeout(() => setIsSaving(false), 1000);
    }, 800),
    [onSave]
  );

  const addImage = async (file: File) => {
    if (!editor) return;
    
    // Upload via Uploader component logic
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Simulate upload - replace with actual upload logic
      const imageUrl = URL.createObjectURL(file);
      
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const setLink = () => {
    if (!editor) return;
    
    const url = window.prompt('URL du lien:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    disabled = false 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-iris-500/20 text-iris-400' 
          : 'text-white/70 hover:text-white hover:bg-white/10'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-white/70">Chargement de l'éditeur...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 glass p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Formatting */}
          <div className="flex items-center gap-1 border-r border-white/10 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-white/10 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
            >
              <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-white/10 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1 border-r border-white/10 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().setColor('#6366F1').run()}
              isActive={editor.isActive('textStyle', { color: '#6366F1' })}
            >
              <Palette className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHighlight({ color: '#FDE047' }).run()}
              isActive={editor.isActive('highlight')}
            >
              <div className="h-4 w-4 bg-yellow-400 rounded-sm" />
            </ToolbarButton>
          </div>

          {/* Media */}
          <div className="flex items-center gap-1 border-r border-white/10 pr-2">
            <ToolbarButton onClick={setLink}>
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) addImage(file);
                }}
                className="hidden"
              />
              <ToolbarButton onClick={() => {}}>
                <ImageIcon className="h-4 w-4" />
              </ToolbarButton>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <ToolbarButton onClick={onAIClick}>
              <Sparkles className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => debouncedSave(editor.getJSON(), editor.getText())}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-white/70">
            {isSaving ? (
              <>
                <div className="animate-spin h-3 w-3 border border-iris-400 border-t-transparent rounded-full" />
                <span>Enregistrement...</span>
              </>
            ) : lastSaved ? (
              <>
                <div className="h-2 w-2 bg-emerald-400 rounded-full" />
                <span>Enregistré à {lastSaved.toLocaleTimeString('fr-FR')}</span>
              </>
            ) : (
              <span>Prêt</span>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="glass p-6 rounded-xl min-h-[400px]">
        <EditorContent 
          editor={editor} 
          className="prose prose-invert max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
