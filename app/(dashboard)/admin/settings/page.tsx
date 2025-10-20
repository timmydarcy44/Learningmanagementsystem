import { PageHeader } from '@/components/admin/PageHeader';
import { Building2, Users, Shield, Palette, Bell, Globe } from 'lucide-react';

export default function SettingsPage() {
  const settingsSections = [
    {
      id: 'organization',
      title: 'Organisation',
      description: 'Informations générales de votre organisation',
      icon: Building2,
      fields: [
        { label: 'Nom de l\'organisation', value: 'LMS Organisation', type: 'text' },
        { label: 'Description', value: 'Plateforme d\'apprentissage en ligne', type: 'textarea' },
        { label: 'Site web', value: 'https://example.com', type: 'url' },
        { label: 'Email de contact', value: 'contact@example.com', type: 'email' },
      ]
    },
    {
      id: 'users',
      title: 'Gestion des utilisateurs',
      description: 'Paramètres d\'inscription et de gestion des utilisateurs',
      icon: Users,
      fields: [
        { label: 'Inscription automatique', value: 'Désactivée', type: 'toggle' },
        { label: 'Validation email requise', value: 'Activée', type: 'toggle' },
        { label: 'Limite d\'utilisateurs', value: '1000', type: 'number' },
      ]
    },
    {
      id: 'security',
      title: 'Sécurité',
      description: 'Paramètres de sécurité et d\'authentification',
      icon: Shield,
      fields: [
        { label: 'Authentification à deux facteurs', value: 'Activée', type: 'toggle' },
        { label: 'Durée de session', value: '24 heures', type: 'select' },
        { label: 'Tentatives de connexion', value: '5', type: 'number' },
      ]
    },
    {
      id: 'appearance',
      title: 'Apparence',
      description: 'Personnalisation de l\'interface',
      icon: Palette,
      fields: [
        { label: 'Thème', value: 'Sombre', type: 'select' },
        { label: 'Couleur principale', value: '#6366f1', type: 'color' },
        { label: 'Logo', value: 'logo.png', type: 'file' },
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Paramètres de notification par email',
      icon: Bell,
      fields: [
        { label: 'Nouveaux utilisateurs', value: 'Activée', type: 'toggle' },
        { label: 'Formations publiées', value: 'Activée', type: 'toggle' },
        { label: 'Rapports hebdomadaires', value: 'Désactivée', type: 'toggle' },
      ]
    },
    {
      id: 'integrations',
      title: 'Intégrations',
      description: 'Services externes et API',
      icon: Globe,
      fields: [
        { label: 'Google Analytics', value: 'Non configuré', type: 'text' },
        { label: 'Stripe (paiements)', value: 'Non configuré', type: 'text' },
        { label: 'Webhook URL', value: '', type: 'url' },
      ]
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Paramètres"
        subtitle="Configurez votre organisation et vos préférences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section) => (
          <div key={section.id} className="glass p-6 rounded-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-iris-500/20 rounded-xl">
                <section.icon className="h-6 w-6 text-iris-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                <p className="text-white/70 text-sm mt-1">{section.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {section.fields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    {field.label}
                  </label>
                  
                  {field.type === 'text' && (
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
                    />
                  )}
                  
                  {field.type === 'textarea' && (
                    <textarea
                      rows={3}
                      defaultValue={field.value}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
                    />
                  )}
                  
                  {field.type === 'email' && (
                    <input
                      type="email"
                      defaultValue={field.value}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
                    />
                  )}
                  
                  {field.type === 'url' && (
                    <input
                      type="url"
                      defaultValue={field.value}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
                    />
                  )}
                  
                  {field.type === 'number' && (
                    <input
                      type="number"
                      defaultValue={field.value}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50">
                      <option value={field.value}>{field.value}</option>
                    </select>
                  )}
                  
                  {field.type === 'color' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        defaultValue={field.value}
                        className="w-12 h-12 rounded-lg border border-white/10"
                      />
                      <input
                        type="text"
                        defaultValue={field.value}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-iris-500/50 focus:border-iris-500/50"
                      />
                    </div>
                  )}
                  
                  {field.type === 'file' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-iris-500 file:text-white"
                      />
                      {field.value && (
                        <span className="text-white/70 text-sm">{field.value}</span>
                      )}
                    </div>
                  )}
                  
                  {field.type === 'toggle' && (
                    <div className="flex items-center gap-3">
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          field.value === 'Activée' ? 'bg-iris-500' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            field.value === 'Activée' ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-white/70 text-sm">{field.value}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <button className="px-4 py-2 bg-iris-500 hover:bg-iris-400 text-white font-medium rounded-xl transition-colors">
                Sauvegarder les modifications
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
