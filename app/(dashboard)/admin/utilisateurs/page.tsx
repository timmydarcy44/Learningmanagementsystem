'use client';

import { inviteUserAction } from './actions';
import { PageHeader } from '@/components/admin/PageHeader';
import { Users, UserCheck, GraduationCap, BookOpen } from 'lucide-react';
import InviteLearnerForm from './InviteLearnerForm';

export default function UtilisateursPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        subtitle="Gérez les formateurs, tuteurs et apprenants de votre organisation"
      />

      {/* Formulaire d'invitation */}
      <div>
        <h2 className="text-2xl font-semibold text-iris-grad">Inviter un utilisateur</h2>
        <form action={inviteUserAction} className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 glass p-4 rounded-2xl">
          <input 
            name="email" 
            type="email" 
            placeholder="email@exemple.com" 
            className="h-11 rounded-xl bg-white/5 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50" 
            required 
          />
          <select 
            name="role" 
            className="h-11 rounded-xl bg-white/5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-iris-500/50"
          >
            <option value="instructor">Formateur</option>
            <option value="tutor">Tuteur</option>
            <option value="learner">Apprenant</option>
          </select>
          <input 
            name="org_id" 
            type="text" 
            placeholder="org_id" 
            className="h-11 rounded-xl bg-white/5 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50" 
            required 
          />
          <button className="btn-cta">Inviter</button>
        </form>
        <p className="text-xs opacity-70 mt-2">NB : Admin peut inviter Formateur/Tuteur. Formateur peut inviter Apprenant.</p>
      </div>

      {/* Formulaire d'invitation d'apprenant avec magic link */}
      <div>
        <h2 className="text-2xl font-semibold text-iris-grad">Inviter un apprenant (avec magic link)</h2>
        <div className="mt-4">
          <InviteLearnerForm />
        </div>
        <p className="text-xs opacity-70 mt-2">Ce formulaire crée un utilisateur apprenant et envoie un magic link pour définir le mot de passe.</p>
      </div>

      {/* Statistiques des utilisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70">Formateurs</p>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-xs text-green-400">+2 ce mois</p>
            </div>
            <div className="p-3 bg-iris-500/20 rounded-xl">
              <BookOpen className="h-6 w-6 text-iris-400" />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70">Tuteurs</p>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-xs text-green-400">+1 ce mois</p>
            </div>
            <div className="p-3 bg-blush-500/20 rounded-xl">
              <UserCheck className="h-6 w-6 text-blush-400" />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70">Apprenants</p>
              <p className="text-2xl font-bold text-white">156</p>
              <p className="text-xs text-green-400">+12 ce mois</p>
            </div>
            <div className="p-3 bg-lime-500/20 rounded-xl">
              <GraduationCap className="h-6 w-6 text-lime-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs récents */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-iris-400" />
          Utilisateurs récents
        </h3>
        
        <div className="space-y-3">
          {[
            { name: 'Marie Dubois', email: 'marie@example.com', role: 'Formateur', status: 'Actif', date: 'Il y a 2h' },
            { name: 'Jean Martin', email: 'jean@example.com', role: 'Tuteur', status: 'Actif', date: 'Il y a 4h' },
            { name: 'Sophie Leroy', email: 'sophie@example.com', role: 'Apprenant', status: 'Actif', date: 'Il y a 6h' },
            { name: 'Pierre Durand', email: 'pierre@example.com', role: 'Formateur', status: 'En attente', date: 'Il y a 8h' },
            { name: 'Anna Petit', email: 'anna@example.com', role: 'Apprenant', status: 'Actif', date: 'Il y a 12h' },
          ].map((user, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-iris-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-white/70 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{user.role}</p>
                <p className={`text-sm ${
                  user.status === 'Actif' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {user.status}
                </p>
                <p className="text-white/50 text-xs">{user.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}