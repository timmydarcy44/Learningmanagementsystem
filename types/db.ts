export type VisibilityMode = 'catalog_only' | 'pathway_only' | 'both';

export interface Formation {
  id: string;
  title: string;
  description?: string;
  visibility_mode: VisibilityMode;
  published: boolean;
  cover_url?: string;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  title: string;
  order_index: number;
  formation_id: string;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  title: string;
  order_index: number;
  section_id: string;
  created_at: string;
  updated_at: string;
}

export interface Subchapter {
  id: string;
  title: string;
  order_index: number;
  chapter_id: string;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  kind: 'text' | 'link' | 'image' | 'video' | 'file';
  data: ContentData;
  order_index: number;
  section_id?: string;
  chapter_id?: string;
  subchapter_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentData {
  text?: string;
  url?: string;
  label?: string;
  storage_path?: string;
  alt?: string;
  duration?: number;
}

export interface FormationHierarchy {
  formation: Formation;
  sections: Array<Section & {
    chapters: Array<Chapter & {
      subchapters: Array<Subchapter>;
      content: ContentItem[];
    }>;
    content: ContentItem[];
  }>;
}

export interface OrgMembership {
  id: string;
  org_id: string;
  user_id: string;
  role: string;
  created_at: string;
}
