export default function ConfigPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-4xl glass p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            Configuration <span className="text-grad bg-iris-grad">Supabase</span>
          </h1>
          <p className="text-neutral-300 text-lg">
            Guide complet pour configurer l'authentification Supabase
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Étape 1: Projet Supabase */}
          <div className="space-y-6">
            <div className="p-6 bg-dark-elevated rounded-xl">
              <h3 className="font-semibold text-neutral-100 mb-4 text-lg">1. Créer un projet Supabase</h3>
              <ol className="text-sm text-neutral-300 space-y-3">
                <li>• Allez sur <a href="https://supabase.com" className="text-iris-400 hover:underline" target="_blank">supabase.com</a></li>
                <li>• Créez un nouveau projet</li>
                <li>• Récupérez l'URL et les clés API</li>
              </ol>
            </div>
            
            <div className="p-6 bg-dark-elevated rounded-xl">
              <h3 className="font-semibold text-neutral-100 mb-4 text-lg">2. Créer le fichier .env.local</h3>
              <p className="text-sm text-neutral-400 mb-4">
                Dans la racine du projet, créez un fichier <code className="bg-dark-muted px-2 py-1 rounded">.env.local</code> :
              </p>
              <pre className="text-xs bg-dark-muted p-4 rounded overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...`}
              </pre>
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-300">
                  ⚠️ <strong>Important :</strong> Pas d'espaces, pas de guillemets, pas de slash final dans l'URL
                </p>
              </div>
            </div>
          </div>
          
          {/* Étape 2: Configuration Supabase */}
          <div className="space-y-6">
            <div className="p-6 bg-dark-elevated rounded-xl">
              <h3 className="font-semibold text-neutral-100 mb-4 text-lg">3. Configuration Auth</h3>
              <p className="text-sm text-neutral-400 mb-4">
                Dans Supabase Dashboard → Authentication → URL Configuration :
              </p>
              <ul className="text-sm text-neutral-300 space-y-2">
                <li>• <strong>Site URL :</strong> <code className="bg-dark-muted px-2 py-1 rounded">http://localhost:3000</code></li>
                <li>• <strong>Redirect URLs :</strong></li>
                <li className="ml-4">- <code className="bg-dark-muted px-2 py-1 rounded">http://localhost:3000</code></li>
                <li className="ml-4">- <code className="bg-dark-muted px-2 py-1 rounded">http://localhost:3000/login</code></li>
                <li className="ml-4">- <code className="bg-dark-muted px-2 py-1 rounded">http://localhost:3000/app</code></li>
              </ul>
            </div>
            
            <div className="p-6 bg-dark-elevated rounded-xl">
              <h3 className="font-semibold text-neutral-100 mb-4 text-lg">4. Créer la table formations</h3>
              <p className="text-sm text-neutral-400 mb-4">
                Dans l'éditeur SQL de Supabase :
              </p>
              <pre className="text-xs bg-dark-muted p-4 rounded overflow-x-auto">
{`CREATE TABLE formations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  visibility_mode TEXT DEFAULT 'public',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer des données de test
INSERT INTO formations (title, visibility_mode, published) VALUES
('Introduction à React', 'public', true),
('Next.js Avancé', 'private', true),
('TypeScript Fundamentals', 'public', false);`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Tests et vérifications */}
        <div className="mt-8 p-6 bg-dark-elevated rounded-xl">
          <h3 className="font-semibold text-neutral-100 mb-4 text-lg">5. Tests et vérifications</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a 
              href="/api/env-check" 
              className="p-4 bg-gradient-to-r from-iris-500 to-cyan-400 text-white rounded-xl hover:opacity-90 transition-opacity text-center"
            >
              🔍 Vérifier les variables
            </a>
            <a 
              href="/api/sb-health" 
              className="p-4 bg-gradient-to-r from-blush-500 to-lime-400 text-white rounded-xl hover:opacity-90 transition-opacity text-center"
            >
              🏥 Test connexion DB
            </a>
            <a 
              href="/debug-login" 
              className="p-4 bg-gradient-to-r from-lime-400 to-cyan-400 text-white rounded-xl hover:opacity-90 transition-opacity text-center"
            >
              🐛 Debug authentification
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="inline-block rounded-2xl px-8 py-4 bg-gradient-to-r from-iris-500 to-cyan-400 text-white hover:opacity-90 transition-opacity font-medium"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}