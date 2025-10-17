'use client';
import { supabaseBrowser } from '@/lib/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LoginPage() {
  const params = useSearchParams();
  const router = useRouter();
  const redirectTo = params.get('redirect') || '/app';
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const supabase = supabaseBrowser();
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) router.replace(redirectTo);
      });
      return () => sub.subscription.unsubscribe();
    } catch (error) {
      setSupabaseError(error instanceof Error ? error.message : 'Configuration Supabase manquante');
    }
  }, [router, redirectTo]);

  if (supabaseError) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center px-6">
        <div className="w-full max-w-md glass p-6 text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-red-400 mb-4">
              Configuration requise
            </h1>
            <p className="text-neutral-300 mb-6">
              {supabaseError}
            </p>
          </div>
          <div className="space-y-4">
            <a 
              href="/config" 
              className="block rounded-2xl px-6 py-3 bg-gradient-to-r from-iris-500 to-cyan-400 text-white hover:opacity-90 transition-opacity"
            >
              Configurer Supabase
            </a>
            <Link href="/" className="block text-neutral-300 hover:underline">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const supabase = supabaseBrowser();

  return (
    <div className="min-h-[100svh] flex items-center justify-center px-6">
      <div className="w-full max-w-md glass p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            Connectez-vous <span className="text-grad bg-iris-grad">LMS</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-300">Accédez à votre espace sécurisé.</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: { borderRadius: 16, height: 44 },
              input: { backgroundColor: 'rgba(255,255,255,0.04)', color: '#F8FAFC' },
            },
            variables: {
              default: {
                colors: {
                  brand: '#6366F1',
                  brandAccent: '#22D3EE',
                  inputText: '#F8FAFC',
                  inputBorder: 'rgba(255,255,255,0.1)',
                },
                radii: { buttonBorderRadius: '16px', inputBorderRadius: '16px' },
              },
            },
          }}
          providers={[]}
          localization={{ variables: { sign_in: { email_label: 'Email', button_label: 'Envoyer le lien' } } }}
          theme="dark"
          onlyThirdPartyProviders={false}
        />
        <div className="mt-4 text-xs text-neutral-400">
          En cliquant, vous recevrez un lien de connexion par email.
        </div>
        <div className="mt-6 text-center text-sm">
          <Link href="/" className="text-neutral-300 hover:underline">← Retour</Link>
        </div>
      </div>
    </div>
  );
}