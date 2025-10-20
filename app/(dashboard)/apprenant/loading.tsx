export default function Loading() {
  return (
    <div className="min-h-screen bg-[#252525] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-400">Chargement...</p>
      </div>
    </div>
  );
}