// app/(dashboard)/admin/utilisateurs/invite-learner-with-assignments.ts
'use server';

import { supabaseServer } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { absoluteUrl } from '@/lib/url';

type Payload = {
  learnerEmail: string;
  instructorEmail?: string;
  redirectTo?: string;
  formationIds?: string[];
  testIds?: string[];
  resourceIds?: string[];
  pathwayIds?: string[];
};

function isAlreadyRegistered(err?: { message?: string }) {
  return !!err?.message && /already registered/i.test(err.message);
}

export async function inviteLearnerWithAssignments(p: Payload) {
  const sb = await supabaseServer();
  const admin = supabaseAdmin();

  const { data: { user: me } } = await sb.auth.getUser();
  if (!me) throw new Error('Non authentifié');

  const instructorEmail = (p.instructorEmail || me.email || '').trim().toLowerCase();
  const learnerEmail    = p.learnerEmail.trim().toLowerCase();
  const redirectTo      = p.redirectTo || await absoluteUrl('/create-password');

  // 1) Résoudre formateur (id) + org
  // via profiles, sinon via RPC (pas d'échec si profile pas créé)
  let { data: profInstr } = await sb.from('profiles').select('id,email').eq('email', instructorEmail).maybeSingle();
  if (!profInstr) {
    const { data: rpcId, error: rpcErr } = await sb.rpc('get_user_id_by_email', { p_email: instructorEmail });
    if (rpcErr || !rpcId) throw new Error("Formateur introuvable");
    profInstr = { id: rpcId as string, email: instructorEmail } as any;
  }

  const { data: memberships, error: memErr } = await sb
    .from('org_memberships').select('org_id, role').eq('user_id', profInstr!.id);
  if (memErr || !memberships?.length) throw new Error("Le formateur n'appartient à aucune organisation");

  const adminMem = memberships.find(m => m.role === 'admin');
  const instrMem = memberships.find(m => m.role === 'instructor');
  const orgId = (adminMem ?? instrMem ?? memberships[0]).org_id as string;

  // 2) Créer l'apprenant OU récupérer son id (idempotent)
  let learnerId: string | null = null;

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: learnerEmail,
    email_confirm: false,
    user_metadata: { role: 'learner' }
  });

  if (createErr && !isAlreadyRegistered(createErr)) {
    throw new Error(`Création utilisateur échouée: ${createErr.message}`);
  }

  if (createErr && isAlreadyRegistered(createErr)) {
    // Déjà existant → récupérer l'ID de manière fiable
    // 1) via Admin API (quand dispo)
    try {
      const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1, email: learnerEmail } as any);
      learnerId = data?.users?.[0]?.id ?? null;
    } catch { /* ignore */ }

    // 2) fallback via RPC si pas trouvé
    if (!learnerId) {
      const { data: rpcId, error: rpcErr } = await sb.rpc('get_user_id_by_email', { p_email: learnerEmail });
      if (rpcErr || !rpcId) throw new Error("Utilisateur existant mais ID introuvable");
      learnerId = rpcId as string;
    }
  } else {
    learnerId = created?.user?.id ?? null;
  }

  if (!learnerId) throw new Error('Impossible de determiner l\'ID de l\'apprenant');

  // 3) Upsert membership learner + lien formateur↔apprenant (via service role → bypass RLS)
  {
    const { error } = await admin.from('org_memberships')
      .upsert({ org_id: orgId, user_id: learnerId, role: 'learner' }).select().maybeSingle();
    if (error) throw new Error(`Ajout membership échoué: ${error.message}`);
  }
  {
    const { error } = await admin.from('instructor_learners')
      .upsert({ org_id: orgId, instructor_id: profInstr!.id, learner_id: learnerId }).select().maybeSingle();
    if (error) throw new Error(`Lien formateur-apprenant échoué: ${error.message}`);
  }

  // 4) Assignations
  const pathwayIds  = p.pathwayIds?.filter(Boolean) ?? [];
  const testIds     = p.testIds?.filter(Boolean) ?? [];
  const resourceIds = p.resourceIds?.filter(Boolean) ?? [];
  const formationIds= p.formationIds?.filter(Boolean) ?? [];

  for (const pid of pathwayIds) {
    const { error } = await admin.from('pathway_assignments')
      .upsert({ pathway_id: pid, target_type: 'learner', target_id: learnerId }).select().maybeSingle();
    if (error && error.code !== '23505') throw new Error(`Assignation parcours ${pid} échouée: ${error.message}`);
  }

  for (const tid of testIds) {
    const { error } = await admin.from('test_assignments')
      .upsert({ org_id: orgId, test_id: tid, target_type: 'learner', target_id: learnerId }).select().maybeSingle();
    if (error && error.code !== '23505') throw new Error(`Assignation test ${tid} échouée: ${error.message}`);
  }

  for (const rid of resourceIds) {
    const { error } = await admin.from('resource_assignments')
      .upsert({ org_id: orgId, resource_id: rid, target_type: 'learner', target_id: learnerId }).select().maybeSingle();
    if (error && error.code !== '23505') throw new Error(`Assignation ressource ${rid} échouée: ${error.message}`);
  }

  if (formationIds.length) {
    // parcours perso "Starter Pack — <email>"
    const title = `Starter Pack — ${learnerEmail}`;
    let pathwayId: string | null = null;

    {
      const { data } = await admin.from('pathways')
        .select('id').eq('org_id', orgId).eq('title', title).maybeSingle();
      pathwayId = data?.id ?? null;
    }
    if (!pathwayId) {
      const { data, error } = await admin.from('pathways').insert({
        org_id: orgId,
        title, description: `Parcours personnel pour ${learnerEmail}`,
        visibility_mode: 'private', published: false, created_by: profInstr!.id
      }).select('id').single();
      if (error) throw new Error(`Création parcours perso échouée: ${error.message}`);
      pathwayId = data.id;
    }

    for (const fid of formationIds) {
      const { data: last } = await admin.from('pathway_items')
        .select('position').eq('pathway_id', pathwayId)
        .order('position', { ascending: false }).limit(1).maybeSingle();
      const pos = (last?.position ?? -1) + 1;

      const { error } = await admin.from('pathway_items')
        .upsert({ pathway_id: pathwayId, item_type: 'formation', item_id: fid, position: pos })
        .select().maybeSingle();
      if (error && error.code !== '23505') throw new Error(`Ajout formation ${fid} au parcours perso échoué: ${error.message}`);
    }

    const { error: paErr } = await admin.from('pathway_assignments')
      .upsert({ pathway_id: pathwayId, target_type: 'learner', target_id: learnerId })
      .select().maybeSingle();
    if (paErr && paErr.code !== '23505') throw new Error(`Assignation parcours perso échouée: ${paErr.message}`);
  }

  // 5) Magic link (non bloquant)
  let magicLinkSent = true;
  const { error: otpErr } = await sb.auth.signInWithOtp({
    email: learnerEmail,
    options: { emailRedirectTo: redirectTo }
  });
  if (otpErr) { magicLinkSent = false; console.warn('Magic link non envoyé:', otpErr.message); }

  return {
    ok: true,
    orgId,
    instructorId: profInstr!.id,
    learnerId,
    assigned: {
      formations: formationIds.length,
      tests: testIds.length,
      resources: resourceIds.length,
      pathways: pathwayIds.length
    },
    magicLinkSent,
    alreadyExisted: Boolean(createErr && isAlreadyRegistered(createErr)),
  };
}

// Action pour récupérer les organisations du formateur
export async function getInstructorOrganizations() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data: memberships, error } = await sb
    .from('org_memberships')
    .select(`
      org_id,
      role,
      organizations!inner(
        id,
        name,
        slug
      )
    `)
    .eq('user_id', user.id)
    .order('role', { ascending: false }); // admin en premier

  if (error) throw new Error('Erreur lors de la récupération des organisations');

  return memberships?.map(m => ({
    id: m.org_id,
    name: (m as any).organizations.name,
    slug: (m as any).organizations.slug,
    role: m.role
  })) || [];
}