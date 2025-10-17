export default function Home() {
  return (
    <div className="min-h-screen bg-[#252525] text-neutral-100 p-8">
      <h1 className="text-4xl font-bold mb-8">
        LMS - <span className="bg-gradient-to-r from-iris-500 to-cyan-400 bg-clip-text text-transparent">Dark Premium</span>
      </h1>
      
      <div className="space-y-6">
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">🚀 Système d'authentification Supabase</h2>
          <p className="text-neutral-300 mb-4">
            Le LMS est maintenant équipé d'un système d'authentification complet avec Supabase.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-dark-elevated rounded-xl">
              <h3 className="font-semibold text-iris-400 mb-2">✅ Fonctionnalités implémentées</h3>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li>• Authentification email OTP / Magic Link</li>
                <li>• Routes protégées avec middleware</li>
                <li>• Dashboard avec formations Supabase</li>
                <li>• Navbar avec menu utilisateur</li>
                <li>• Design dark premium maintenu</li>
              </ul>
            </div>
            
            <div className="p-4 bg-dark-elevated rounded-xl">
              <h3 className="font-semibold text-blush-400 mb-2">⚙️ Configuration requise</h3>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li>• Créer un projet Supabase</li>
                <li>• Configurer .env.local</li>
                <li>• Créer la table formations</li>
                <li>• Redémarrer le serveur</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <a 
            href="/config" 
            className="px-6 py-3 bg-gradient-to-r from-iris-500 to-cyan-400 text-white rounded-2xl hover:opacity-90 transition-opacity"
          >
            📋 Guide de configuration
          </a>
          <a 
            href="/login" 
            className="px-6 py-3 glass text-neutral-100 rounded-2xl hover:opacity-90 transition-opacity"
          >
            🔐 Page de connexion
          </a>
        </div>
      </div>
    </div>
  );
}