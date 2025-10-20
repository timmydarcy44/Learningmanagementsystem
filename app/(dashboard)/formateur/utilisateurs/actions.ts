'use server';

import { createClient } from '@supabase/supabase-js';
import { supabaseServer } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/getUserRole';
import { getCurrentOrgId } from '@/lib/org';
import { updateOrInsert } from '@/lib/dbSafe';
import { revalidatePath } from 'next/cache';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function inviteLearnerAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  
  if (!email) {
    throw new Error('Email requis.');
  }

  // Vérifier que l'utilisateur actuel est un formateur
  const sbSSR = await supabaseServer();
  const { data: { user } } = await sbSSR.auth.getUser();
  if (!user) {
    throw new Error('Non authentifié.');
  }

  const role = await getUserRole(user.id);
  if (role !== 'instructor') {
    throw new Error('Seuls les formateurs peuvent inviter des apprenants.');
  }

  const orgId = await getCurrentOrgId();
  if (!orgId) {
    throw new Error('Organisation non trouvée.');
  }

  // Admin API avec service role
  const admin = createClient(url, service, { auth: { persistSession: false } });

  // 1) Créer (ou récupérer) l'utilisateur
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (createErr && !createErr.message?.includes('already registered')) {
    throw new Error(createErr.message);
  }

  const userId = created?.user?.id ?? (
    (await admin.auth.admin.listUsers({ page: 1, perPage: 1 })).data?.users?.find(u => u.email === email)?.id
  );
  if (!userId) throw new Error("Impossible de récupérer l'ID utilisateur.");

  // 2) Ajouter le membership comme apprenant (sans onConflict)
  const resMem = await updateOrInsert(
    admin,
    'org_memberships',
    { org_id: orgId, user_id: userId },
    { role: 'learner' }
  );

  // 3) Générer magic link pour l'apprenant
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `http://localhost:3000/auth/callback` },
  });
  if (linkErr) throw new Error('Échec génération magic link: ' + linkErr.message);
  revalidatePath('/formateur/utilisateurs');
}