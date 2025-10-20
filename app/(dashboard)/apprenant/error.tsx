'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#252525] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="glass p-8 rounded-2xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold text-white mb-4">
            Une erreur s'est produite
          </h1>
          
          <p className="text-neutral-400 mb-6">
            Désolé, une erreur inattendue s'est produite. Veuillez réessayer.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl font-medium transition-all duration-300"
            >
              Réessayer
            </button>
            
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium border border-white/10 transition-all duration-300"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}