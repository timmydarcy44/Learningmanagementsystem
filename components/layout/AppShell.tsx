'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: 'admin' | 'instructor' | 'tutor' | 'learner';
}) {
  return (
    <div className="min-h-screen bg-[#252525] text-neutral-100">
      {/* grid 2 colonnes : sidebar 260px + contenu */}
      <div className="grid grid-cols-[260px_1fr] min-h-screen">
        {/* Sidebar sticky, pas d'espace inutile en haut */}
        <aside className="sticky top-0 h-svh overflow-y-auto border-r border-white/10 bg-white/5 backdrop-blur-md">
          <Sidebar role={role} />
        </aside>

        {/* Colonne contenu : topbar compacte + page content */}
        <div className="min-h-svh flex flex-col">
          <Topbar />
          {/* Contenu : commence tout en haut, padding contrôlé ici */}
          <main className="flex-1 px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}