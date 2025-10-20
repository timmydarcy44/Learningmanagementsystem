import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface VideoNodeViewProps {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
}

export function VideoNodeView({ node, updateAttributes }: VideoNodeViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { src, title } = node.attrs || { src: '', title: '' };

  // Extraire l'ID de la vidéo YouTube
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(src);
  const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleOpenExternal = () => {
    window.open(src, '_blank');
  };

  if (isPlaying && youtubeId) {
    return (
      <NodeViewWrapper className="video-wrapper">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title={title || 'Vidéo YouTube'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="video-wrapper">
      <div className="relative group">
        {thumbnailUrl ? (
          <div className="relative w-full rounded-lg overflow-hidden bg-gray-800">
            <img
              src={thumbnailUrl}
              alt={title || 'Miniature vidéo'}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                onClick={handlePlay}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-colors"
              >
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              </button>
            </div>
            <div className="absolute top-2 right-2">
              <button
                onClick={handleOpenExternal}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                title="Ouvrir dans YouTube"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center text-white/70">
              <Play className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Vidéo non supportée</p>
              <button
                onClick={handleOpenExternal}
                className="mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Ouvrir le lien
              </button>
            </div>
          </div>
        )}
        {title && (
          <p className="mt-2 text-sm text-white/70 text-center">{title}</p>
        )}
      </div>
    </NodeViewWrapper>
  );
}
