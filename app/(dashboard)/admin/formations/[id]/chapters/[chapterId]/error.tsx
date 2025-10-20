'use client';

export default function Error({ error }: { error: any }) {
  return (
    <div className="min-h-screen grid place-items-center bg-[#252525] text-neutral-100">
      <div className="glass p-8 rounded-2xl max-w-lg text-center">
        <h1 className="text-xl font-semibold text-white mb-4">Erreur de chargement</h1>
        <p className="text-white/70 mb-6">
          Une erreur s'est produite lors du chargement de l'éditeur de chapitre.
        </p>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <pre className="text-xs text-red-400 whitespace-pre-wrap">
            {String(error?.message ?? error)}
          </pre>
        </div>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-iris-500 hover:bg-iris-400 text-white font-medium rounded-xl transition-colors"
          >
            Recharger
          </button>
          <a 
            href="/admin/formations"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
          >
            Retour aux formations
          </a>
        </div>
      </div>
    </div>
  );
}
