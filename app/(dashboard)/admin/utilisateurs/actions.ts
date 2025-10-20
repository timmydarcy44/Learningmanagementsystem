'use server';

import { createClient } from '@supabase/supabase-js';
import { supabaseServer } from '@/lib/supabase/server';
import { updateOrInsert } from '@/lib/dbSafe';
import { revalidatePath } from 'next/cache';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Ne JAMAIS exposer côté client

type Role = 'instructor' | 'tutor' | 'learner';

export async function inviteUserAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const role = String(formData.get('role') || '') as Role;
  const orgId = String(formData.get('org_id') || '');

  if (!email || !role || !orgId) throw new Error('Champs requis manquants.');
  if (!['instructor', 'tutor', 'learner'].includes(role)) throw new Error('Rôle non autorisé.');

  // Vérifier permissions de l'appelant
  const sbSSR = await supabaseServer();
  const { data: { user } } = await sbSSR.auth.getUser();
  if (!user) throw new Error('Non authentifié.');

  const { data: me, error: meErr } = await sbSSR
    .from('org_memberships')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (meErr) throw new Error(meErr.message);

  const canCreate =
    (me?.role === 'admin' && (role === 'instructor' || role === 'tutor')) ||
    (me?.role === 'instructor' && role === 'learner');

  if (!canCreate) throw new Error('Permissions insuffisantes.');

  // Admin client (service role)
  const admin = createClient(url, service, { auth: { persistSession: false } });

  // 1) Créer (ou retrouver) l'utilisateur
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  let userId = created?.user?.id;

  // Si "already registered", on tente de retrouver l'utilisateur via listUsers()
  if (!userId && createErr && createErr.message?.toLowerCase().includes('already')) {
    const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    userId = listed.data?.users?.find((u) => u.email?.toLowerCase() === email)?.id;
  }

  if (createErr && !userId) {
    throw new Error(createErr.message);
  }

  if (!userId) throw new Error("Impossible de récupérer l'ID utilisateur.");

  // 2) membership (sans onConflict)
  const resMem = await updateOrInsert(
    admin,
    'org_memberships',
    { org_id: orgId, user_id: userId },
    { role }
  );

  // 3) Lien : password (formateur) ou magic link (tuteur/apprenant)
  if (role === 'instructor') {
    const { error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `http://localhost:3000/auth/callback?next=/login/formateur`,
    });
    if (error) throw new Error('Échec invitation: ' + error.message);
    revalidatePath('/admin/utilisateurs');
  } else {
    const { data: linkData, error } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `http://localhost:3000/auth/callback` },
    });
    if (error) throw new Error('Échec magic link: ' + error.message);
    revalidatePath('/admin/utilisateurs');
  }
}