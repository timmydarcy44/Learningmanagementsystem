export default function TutorDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="glass p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">Bienvenue dans l'espace Tuteur</h2>
        <p className="text-neutral-400 mb-6">
          Suivez la progression de vos apprenants et offrez-leur un accompagnement personnalisé.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl hover:shadow-elev-3 transition-all duration-300">
            <div className="w-12 h-12 bg-lime-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Mes apprenants</h3>
            <p className="text-sm text-neutral-400">Apprenants sous votre tutelle</p>
          </div>

          <div className="glass p-6 rounded-xl hover:shadow-elev-3 transition-all duration-300">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Progression</h3>
            <p className="text-sm text-neutral-400">Vue d'ensemble de la progression</p>
          </div>

          <div className="glass p-6 rounded-xl hover:shadow-elev-3 transition-all duration-300">
            <div className="w-12 h-12 bg-blush-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blush-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Communication</h3>
            <p className="text-sm text-neutral-400">Messagerie avec les apprenants</p>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="glass p-4 rounded-xl hover:shadow-elev-3 transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white">Voir mes apprenants</h4>
                <p className="text-sm text-neutral-400">Consulter la liste des apprenants</p>
              </div>
            </div>
          </button>

          <button className="glass p-4 rounded-xl hover:shadow-elev-3 transition-all duration-300 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white">Envoyer un message</h4>
                <p className="text-sm text-neutral-400">Communiquer avec les apprenants</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}