export default function ApprenantDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="glass p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">Bienvenue dans l'espace Apprenant</h2>
        <p className="text-neutral-400 mb-6">
          Accédez à vos formations, suivez votre progression et développez vos compétences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl hover:shadow-elev-3 transition-all duration-300">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Mes formations</h3>
            <p className="text-sm text-neutral-400">Formations auxquelles vous êtes inscrit</p>
          </div>

          <div className="glass p-6 rounded-xl hover:shadow-elev-3 transition-all duration-300">
            <div className="w-12 h-12 bg-lime-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Progression</h3>
            <p className="text-sm text-neutral-400">Suivez votre avancement dans les formations</p>
          </div>

          <div className="glass p-6 rounded-xl hover:shadow-elev-3 transition-all duration-300">
            <div className="w-12 h-12 bg-blush-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blush-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Certificats</h3>
            <p className="text-sm text-neutral-400">Vos certifications et diplômes</p>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="glass p-4 rounded-xl hover:shadow-elev-3 transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white">Continuer une formation</h4>
                <p className="text-sm text-neutral-400">Reprendre où vous vous êtes arrêté</p>
              </div>
            </div>
          </button>

          <button className="glass p-4 rounded-xl hover:shadow-elev-3 transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white">Voir mes statistiques</h4>
                <p className="text-sm text-neutral-400">Consulter mes performances</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}