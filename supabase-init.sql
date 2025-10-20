-- Script d'initialisation Supabase pour le LMS
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Créer la table des organisations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table des membres d'organisation
CREATE TABLE IF NOT EXISTS org_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'instructor', 'learner', 'tutor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- 3. Créer la table des formations (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS formations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  visibility_mode TEXT DEFAULT 'both' CHECK (visibility_mode IN ('catalog_only', 'pathway_only', 'both')),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table des sections
CREATE TABLE IF NOT EXISTS sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  formation_id UUID REFERENCES formations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Créer la table des chapitres
CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Créer la table des sous-chapitres
CREATE TABLE IF NOT EXISTS subchapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Créer la table des éléments de contenu
CREATE TABLE IF NOT EXISTS content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  formation_id UUID REFERENCES formations(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  subchapter_id UUID REFERENCES subchapters(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('text', 'link', 'image', 'video', 'file')),
  data JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (
    (section_id IS NOT NULL AND chapter_id IS NULL AND subchapter_id IS NULL) OR
    (section_id IS NULL AND chapter_id IS NOT NULL AND subchapter_id IS NULL) OR
    (section_id IS NULL AND chapter_id IS NULL AND subchapter_id IS NOT NULL)
  )
);

-- 8. Activer RLS sur toutes les tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subchapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- 9. Créer les politiques RLS

-- Politique pour les organisations : les membres peuvent voir leur org
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM org_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Politique pour les membres : les utilisateurs peuvent voir leurs propres membreships
CREATE POLICY "Users can view their own memberships" ON org_memberships
  FOR SELECT USING (user_id = auth.uid());

-- Politique pour les formations : les membres de l'org peuvent voir les formations
CREATE POLICY "Org members can view formations" ON formations
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM org_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Politique pour les formations : les admins/instructeurs peuvent modifier
CREATE POLICY "Admins and instructors can modify formations" ON formations
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM org_memberships 
      WHERE user_id = auth.uid() AND role IN ('admin', 'instructor')
    )
  );

-- Politiques similaires pour sections, chapters, subchapters, content_items
CREATE POLICY "Org members can view sections" ON sections
  FOR SELECT USING (
    formation_id IN (
      SELECT id FROM formations WHERE org_id IN (
        SELECT org_id FROM org_memberships WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins and instructors can modify sections" ON sections
  FOR ALL USING (
    formation_id IN (
      SELECT id FROM formations WHERE org_id IN (
        SELECT org_id FROM org_memberships 
        WHERE user_id = auth.uid() AND role IN ('admin', 'instructor')
      )
    )
  );

-- Répéter pour chapters, subchapters, content_items...
CREATE POLICY "Org members can view chapters" ON chapters
  FOR SELECT USING (
    section_id IN (
      SELECT id FROM sections WHERE formation_id IN (
        SELECT id FROM formations WHERE org_id IN (
          SELECT org_id FROM org_memberships WHERE user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Admins and instructors can modify chapters" ON chapters
  FOR ALL USING (
    section_id IN (
      SELECT id FROM sections WHERE formation_id IN (
        SELECT id FROM formations WHERE org_id IN (
          SELECT org_id FROM org_memberships 
          WHERE user_id = auth.uid() AND role IN ('admin', 'instructor')
        )
      )
    )
  );

CREATE POLICY "Org members can view subchapters" ON subchapters
  FOR SELECT USING (
    chapter_id IN (
      SELECT id FROM chapters WHERE section_id IN (
        SELECT id FROM sections WHERE formation_id IN (
          SELECT id FROM formations WHERE org_id IN (
            SELECT org_id FROM org_memberships WHERE user_id = auth.uid()
          )
        )
      )
    )
  );

CREATE POLICY "Admins and instructors can modify subchapters" ON subchapters
  FOR ALL USING (
    chapter_id IN (
      SELECT id FROM chapters WHERE section_id IN (
        SELECT id FROM sections WHERE formation_id IN (
          SELECT id FROM formations WHERE org_id IN (
            SELECT org_id FROM org_memberships 
            WHERE user_id = auth.uid() AND role IN ('admin', 'instructor')
          )
        )
      )
    )
  );

CREATE POLICY "Org members can view content_items" ON content_items
  FOR SELECT USING (
    formation_id IN (
      SELECT id FROM formations WHERE org_id IN (
        SELECT org_id FROM org_memberships WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins and instructors can modify content_items" ON content_items
  FOR ALL USING (
    formation_id IN (
      SELECT id FROM formations WHERE org_id IN (
        SELECT org_id FROM org_memberships 
        WHERE user_id = auth.uid() AND role IN ('admin', 'instructor')
      )
    )
  );

-- 10. Insérer des données de test
INSERT INTO organizations (name, slug) VALUES 
  ('Académie LMS', 'academie-lms')
ON CONFLICT (slug) DO NOTHING;

-- Créer un utilisateur de test (remplacer par votre email)
-- Note: Vous devrez créer cet utilisateur via l'interface Supabase Auth d'abord
-- INSERT INTO org_memberships (org_id, user_id, role) VALUES 
--   ((SELECT id FROM organizations WHERE slug = 'academie-lms'), 'your-user-id-here', 'admin');

-- Insérer des formations de test
INSERT INTO formations (org_id, title, description, visibility_mode, published) VALUES 
  ((SELECT id FROM organizations WHERE slug = 'academie-lms'), 'Introduction à React', 'Apprenez les bases de React', 'both', true),
  ((SELECT id FROM organizations WHERE slug = 'academie-lms'), 'Next.js Avancé', 'Maîtrisez Next.js', 'both', true),
  ((SELECT id FROM organizations WHERE slug = 'academie-lms'), 'TypeScript Fundamentals', 'Les fondamentaux de TypeScript', 'catalog_only', false)
ON CONFLICT DO NOTHING;