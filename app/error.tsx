'use client';
export default function RootError({ error }: { error: any }) {
  return (
    <div className="min-h-screen grid place-items-center bg-[#252525] text-neutral-100">
      <div className="glass p-6 rounded-2xl max-w-lg">
        <h1 className="text-xl font-semibold">Une erreur s'est produite</h1>
        <pre className="mt-2 text-xs opacity-80 whitespace-pre-wrap">{String(error?.message ?? error)}</pre>
        <a href="/" className="inline-block mt-4 px-4 py-2 rounded-xl bg-iris-500">Revenir à l'accueil</a>
      </div>
    </div>
  );
}