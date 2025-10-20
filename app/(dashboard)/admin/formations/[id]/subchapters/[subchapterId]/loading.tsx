export default function Loading() {
  return (
    <div className="min-h-screen grid place-items-center bg-[#252525] text-neutral-200">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin h-8 w-8 border-2 border-iris-400 border-t-transparent rounded-full" />
        <div className="text-lg font-medium">Chargement de l'éditeur...</div>
        <div className="text-sm text-white/70">Préparation de l'interface</div>
      </div>
    </div>
  );
}
