// Exemple d'utilisation du composant Uploader dans différents contextes

// 1. Dans le Builder de Formation (app/(dashboard)/admin/formations/[id]/page.tsx)
import Uploader from '@/components/admin/Uploader';

// Pour uploader une image de couverture
<Uploader
  orgId={orgId}
  formationId={formationId}
  folder="covers"
  visibility={published ? 'public' : 'private'}
  onUploaded={(objectName, url) => {
    // Enregistrer objectName en base (ex: org_<orgId>/formations/<formationId>/covers/xxx.png)
    // L'URL sera dérivée à l'affichage selon la visibilité
    updateFormation({ cover_url: objectName });
  }}
/>

// Pour uploader des médias dans un chapitre
<Uploader
  orgId={orgId}
  formationId={formationId}
  folder={`chapters/${chapterId}/media`}
  visibility="private"
  onUploaded={(objectName, url) => {
    // Ajouter le média au contenu du chapitre
    updateChapterContent(chapterId, { media_url: objectName });
  }}
/>

// 2. Dans la création de ressources (app/(dashboard)/admin/ressources/new/page.tsx)
<Uploader
  orgId={orgId}
  folder="ressources"
  visibility="catalog_only"
  onUploaded={(objectName, url) => {
    // Créer une nouvelle ressource avec le fichier uploadé
    createResource({ file_url: objectName, type: 'document' });
  }}
/>

// 3. Dans les tests (app/(dashboard)/admin/tests/new/page.tsx)
<Uploader
  orgId={orgId}
  folder="tests/attachments"
  visibility="private"
  onUploaded={(objectName, url) => {
    // Ajouter une pièce jointe au test
    addTestAttachment(testId, objectName);
  }}
/>

// 4. Helper pour dériver les URLs à l'affichage
import { getPublicUrl, createSignedUrl } from '@/lib/storage';

// Dans un composant d'affichage
const getAssetUrl = async (objectName: string, visibility: string) => {
  if (visibility === 'public') {
    return await getPublicUrl(objectName);
  } else {
    return await createSignedUrl(objectName, 3600); // 1 heure
  }
};

// Usage dans un composant
const [imageUrl, setImageUrl] = useState<string>('');

useEffect(() => {
  if (formation.cover_url) {
    getAssetUrl(formation.cover_url, formation.visibility_mode)
      .then(setImageUrl);
  }
}, [formation.cover_url, formation.visibility_mode]);

// 5. Structure des chemins générés
// org_<orgId>/formations/<formationId>/covers/timestamp_filename.jpg
// org_<orgId>/formations/<formationId>/chapters/<chapterId>/media/timestamp_video.mp4
// org_<orgId>/ressources/timestamp_document.pdf
// org_<orgId>/tests/<testId>/attachments/timestamp_image.png

// 6. RLS Storage Policy (à configurer dans Supabase)
// Les utilisateurs ne peuvent uploader que dans leur organisation
// CREATE POLICY "Users can upload to their org folder" ON storage.objects
// FOR INSERT WITH CHECK (
//   bucket_id = 'lms-assets' AND
//   auth.uid()::text = (storage.foldername(name))[1]
// );

// 7. RLS Table Policy pour la table assets
// CREATE POLICY "Users can manage assets in their org" ON assets
// FOR ALL USING (
//   org_id IN (
//     SELECT org_id FROM org_memberships 
//     WHERE user_id = auth.uid()
//   )
// );
