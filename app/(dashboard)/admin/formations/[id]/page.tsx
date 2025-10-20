import { supabaseServer } from '@/lib/supabase/server';
import FormationBuilder from './FormationBuilder';

export const dynamic = 'force-dynamic'; export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const sb = await supabaseServer();
  const { id: formationId } = await params;

  // Récupérer toutes les données en parallèle
  const [{ data: formation }, { data: sections }] = await Promise.all([
    sb.from('formations').select('id, title, reading_mode, visibility_mode, published, org_id').eq('id', formationId).single(),
    sb.from('sections').select('id, title, position').eq('formation_id', formationId).order('position', { ascending:true })
  ]);

  if (!formation) {
    return <div className="text-red-400">Formation non trouvée</div>;
  }

  // Récupérer les chapitres pour toutes les sections
  const sectionIds = sections?.map(s => s.id) ?? [];
  const { data: chapters } = sectionIds.length > 0 
    ? await sb.from('chapters').select('id, section_id, title, position').in('section_id', sectionIds).order('position', { ascending:true })
    : { data: [] };

  // Récupérer les sous-chapitres pour tous les chapitres
  const chapterIds = chapters?.map(c => c.id) ?? [];
  const { data: subchapters } = chapterIds.length > 0
    ? await sb.from('subchapters').select('id, chapter_id, title, position').in('chapter_id', chapterIds).order('position', { ascending:true })
    : { data: [] };

  return (
    <FormationBuilder
      formation={formation}
      sections={sections ?? []}
      chapters={chapters ?? []}
      subchapters={subchapters ?? []}
    />
  );
}