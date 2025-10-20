'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

type CreatePayload = {
  orgId?: string;
  title: string;
  description?: string;
  visibility?: 'private' | 'catalog_only' | 'public';
  published?: boolean;
  readingMode?: 'free' | 'linear';
  coverObjectName?: string | null;
};

export async function createFormationAction(payload: CreatePayload) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  // 1) Récupère TOUS mes memberships (RLS: policy "read_self")
  const { data: memberships, error: memErr } = await sb
    .from('org_memberships')
    .select('org_id, role')
    .eq('user_id', user.id);

  if (memErr) {
    console.error('[createFormation] memberships error:', memErr);
    throw new Error('Impossible de récupérer vos appartenances (RLS).');
  }
  if (!memberships || memberships.length === 0) {
    throw new Error('Aucune organisation associée à votre compte.');
  }

  // 2) Choix de l'org :
  //    - si orgId fourni : vérifier que j'en suis membre
  //    - sinon : prioriser un rôle admin, sinon la première org
  let chosenOrgId = (payload.orgId || '').trim();
  if (chosenOrgId) {
    const found = memberships.find(m => m.org_id === chosenOrgId);
    if (!found) throw new Error('Vous n\'êtes pas membre de cette organisation.');
    if (!['admin','instructor'].includes(found.role)) {
      throw new Error('Permissions insuffisantes (admin ou formateur requis).');
    }
  } else {
    const adminMem = memberships.find(m => m.role === 'admin');
    const pick = adminMem ?? memberships[0];
    if (!['admin','instructor'].includes(pick.role)) {
      throw new Error('Permissions insuffisantes (admin ou formateur requis).');
    }
    chosenOrgId = pick.org_id;
  }

  // 3) Préparer l'insert
  const title = (payload.title || '').trim();
  if (!title) throw new Error('Le titre est obligatoire.');

  const description = payload.description ?? '';
  const visibility_mode = payload.visibility ?? 'catalog_only';
  const published = !!payload.published;
  const reading_mode = payload.readingMode ?? 'free';
  const cover_url = payload.coverObjectName ?? null; // on stocke l'object_name

  // 4) INSERT (une seule requête)
  const { data: inserted, error: insErr } = await sb
    .from('formations')
    .insert({
      org_id: chosenOrgId,
      title,
      description,
      cover_url,
      visibility_mode,
      published,
      reading_mode,
      created_by: user.id,
      status: published ? 'published' : 'draft',
    })
    .select('id')
    .single();

  if (insErr) {
    console.error('[createFormation] insert error:', insErr);
    throw new Error('Échec de création (RLS ou données invalides).');
  }

  revalidatePath('/admin/formations');
  redirect(`/admin/formations/${inserted.id}`);
}