export default function FormateurDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="glass p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">Bienvenue dans l'espace Formateur</h2>
        <p className="text-neutral-400 mb-6">
          Créez et gérez vos formations, suivez vos apprenants et développez votre expertise pédagogique.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl hover:shadow-elev-3 transition-all duration-300">
            <div className="w-12 h-12 bg-blush-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blush-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Mes formations</h3>
            <p className="text-sm text-neutral-400">Gérer vos formations existantes</p>
          </div>

          <div className="glass p-6 rounded-xl hover:shadow-elev-3 transition-all duration-300">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Mes apprenants</h3>
            <p className="text-sm text-neutral-400">Suivre la progression de vos apprenants</p>
          </div>

          <div className="glass p-6 rounded-xl hover:shadow-elev-3 transition-all duration-300">
            <div className="w-12 h-12 bg-lime-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Statistiques</h3>
            <p className="text-sm text-neutral-400">Analyser vos performances pédagogiques</p>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="glass p-4 rounded-xl hover:shadow-elev-3 transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blush-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blush-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white">Nouvelle formation</h4>
                <p className="text-sm text-neutral-400">Créer une nouvelle formation</p>
              </div>
            </div>
          </button>

          <button className="glass p-4 rounded-xl hover:shadow-elev-3 transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white">Créer un apprenant</h4>
                <p className="text-sm text-neutral-400">Ajouter un nouvel apprenant</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}