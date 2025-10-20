'use client';

import { inviteLearnerAction } from './actions';
import { PageHeader } from '@/components/admin/PageHeader';
import { Users, GraduationCap } from 'lucide-react';

export default function FormateurUtilisateursPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mes Apprenants"
        subtitle="Gérez les apprenants de vos formations"
      />

      {/* Formulaire d'invitation d'apprenant */}
      <div>
        <h2 className="text-2xl font-semibold text-iris-grad">Inviter un apprenant</h2>
        <form action={inviteLearnerAction} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 glass p-4 rounded-2xl">
          <input 
            name="email" 
            type="email" 
            placeholder="apprenant@exemple.com" 
            className="h-11 rounded-xl bg-white/5 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50" 
            required 
          />
          <button className="btn-cta">Générer le lien d'invitation</button>
        </form>
        <p className="text-xs opacity-70 mt-2">Seuls les formateurs peuvent inviter des apprenants.</p>
      </div>

      {/* Statistiques */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-70">Apprenants actifs</p>
            <p className="text-3xl font-bold text-white">24</p>
            <p className="text-xs text-green-400">+3 cette semaine</p>
          </div>
          <div className="p-3 bg-lime-500/20 rounded-xl">
            <GraduationCap className="h-8 w-8 text-lime-400" />
          </div>
        </div>
      </div>

      {/* Liste des apprenants */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-iris-400" />
          Mes Apprenants
        </h3>
        
        <div className="space-y-3">
          {[
            { name: 'Alice Martin', email: 'alice@example.com', formations: 3, progress: 85, lastSeen: 'Il y a 1h' },
            { name: 'Bob Dupont', email: 'bob@example.com', formations: 2, progress: 60, lastSeen: 'Il y a 3h' },
            { name: 'Claire Moreau', email: 'claire@example.com', formations: 4, progress: 92, lastSeen: 'Il y a 5h' },
            { name: 'David Leroy', email: 'david@example.com', formations: 1, progress: 30, lastSeen: 'Il y a 1j' },
            { name: 'Emma Petit', email: 'emma@example.com', formations: 2, progress: 75, lastSeen: 'Il y a 2j' },
          ].map((learner, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {learner.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-medium">{learner.name}</p>
                  <p className="text-white/70 text-sm">{learner.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{learner.formations} formations</p>
                <p className="text-sm text-lime-400">{learner.progress}% complété</p>
                <p className="text-white/50 text-xs">{learner.lastSeen}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}