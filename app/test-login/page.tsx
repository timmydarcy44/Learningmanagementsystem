'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function TestLoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<string>('');

  async function testLogin() {
    try {
      const sb = supabaseBrowser();
      
      // Connexion
      const { data: { user }, error } = await sb.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        setResult(`Erreur connexion: ${error.message}`);
        return;
      }
      
      if (!user) {
        setResult('Aucun utilisateur retourné');
        return;
      }
      
      setResult(`Connexion réussie: ${user.email}`);
      
      // Test API role
      const res = await fetch('/api/role', { cache: 'no-store' });
      const json = await res.json();
      
      setResult(prev => prev + `\nRôle: ${json.role || 'null'}`);
      
    } catch (err: any) {
      setResult(`Erreur: ${err.message}`);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 glass p-6 rounded-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-iris-grad">Test Connexion</h1>
      
      <input 
        className="bg-white/5 rounded-xl h-11 w-full px-3" 
        placeholder="Email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
      />
      
      <input 
        className="bg-white/5 rounded-xl h-11 w-full px-3" 
        type="password" 
        placeholder="Mot de passe" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
      
      <button 
        onClick={testLogin}
        className="btn-cta-lg w-full"
      >
        Tester Connexion + Rôle
      </button>
      
      {result && (
        <pre className="bg-black/20 p-3 rounded text-sm whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}
