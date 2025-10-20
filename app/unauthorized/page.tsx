export default function Unauthorized() {
  return (
    <div className="min-h-screen grid place-items-center bg-[#252525] text-neutral-100">
      <div className="glass p-8 rounded-2xl max-w-md text-center space-y-3">
        <div className="text-2xl font-semibold">Accès non autorisé</div>
        <p className="opacity-80">Vous n'avez pas les permissions nécessaires pour cette page.</p>
        <div className="flex gap-3 justify-center">
          <a href="/login/admin" className="px-4 py-2 rounded-xl bg-iris-500">Retour à la connexion</a>
          <a href="/" className="px-4 py-2 rounded-xl bg-white/10">Page d'accueil</a>
        </div>
      </div>
    </div>
  );
}