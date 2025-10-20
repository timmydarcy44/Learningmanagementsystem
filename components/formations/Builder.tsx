'use client';

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Formation, FormationHierarchy, Section, Chapter, Subchapter, ContentItem } from '@/types/db';
import { supabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import VisibilityBadge from './VisibilityBadge';
import { useToast } from '@/components/ui/Toast';

interface BuilderProps {
  formation: Formation;
  hierarchy: FormationHierarchy;
}

interface DraggableItem {
  id: string;
  type: 'section' | 'chapter' | 'subchapter' | 'content';
  parentId?: string;
  data: any;
}

const Builder: React.FC<BuilderProps> = ({ formation, hierarchy }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  
  const { addToast } = useToast();
  const supabase = supabaseBrowser();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    // Handle reordering logic here
    // This would update order_index in the database
    setActiveId(null);
  };

  const handleAddSection = async () => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .insert({
          title: 'Nouvelle section',
          formation_id: formation.id,
          order_index: hierarchy.sections.length + 1,
        })
        .select()
        .single();

      if (error) throw error;
      
      addToast({ type: 'success', message: 'Section ajoutée' });
      // Refresh data or update local state
    } catch (error: any) {
      addToast({ type: 'error', message: error.message });
    }
  };

  const handleEdit = (node: any) => {
    setSelectedNode(node);
    setEditValue(node.title || '');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedNode || !editValue.trim()) return;

    try {
      const table = selectedNode.type === 'section' ? 'sections' : 
                   selectedNode.type === 'chapter' ? 'chapters' : 'subchapters';
      
      const { error } = await supabase
        .from(table)
        .update({ title: editValue.trim() })
        .eq('id', selectedNode.id);

      if (error) throw error;
      
      addToast({ type: 'success', message: 'Titre mis à jour' });
      setIsEditing(false);
      setSelectedNode(null);
    } catch (error: any) {
      addToast({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#252525]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-100 mb-2">
                {formation.title}
              </h1>
              <div className="flex items-center gap-3">
                <VisibilityBadge mode={formation.visibility_mode} />
                <span className={`px-2 py-1 text-xs rounded-full ${
                  formation.published 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {formation.published ? 'Publié' : 'Brouillon'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" size="md">
                Prévisualiser
              </Button>
              <Button variant="primary" size="md">
                Publier
              </Button>
            </div>
          </div>
          
          {formation.description && (
            <p className="text-neutral-400 max-w-2xl">
              {formation.description}
            </p>
          )}
        </div>

        {/* Main Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Formation Meta */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-neutral-100 mb-4">
                Informations
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    defaultValue={formation.title}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-neutral-100 focus:border-iris-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={formation.description || ''}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-neutral-100 focus:border-iris-500 focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Visibilité
                  </label>
                  <select
                    defaultValue={formation.visibility_mode}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-neutral-100 focus:border-iris-500 focus:outline-none"
                  >
                    <option value="catalog_only">Catalogue uniquement</option>
                    <option value="pathway_only">Parcours uniquement</option>
                    <option value="both">Les deux</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Middle: Builder */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-neutral-100">
                  Structure de la formation
                </h3>
                <Button onClick={handleAddSection} variant="primary" size="sm">
                  + Section
                </Button>
              </div>

              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={hierarchy.sections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {hierarchy.sections.map((section) => (
                      <SectionItem
                        key={section.id}
                        section={section}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeId ? (
                    <div className="opacity-50">
                      {/* Render dragged item */}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </Card>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 w-full max-w-md">
              <h3 className="font-semibold text-neutral-100 mb-4">
                Modifier le titre
              </h3>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-neutral-100 focus:border-iris-500 focus:outline-none mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <Button onClick={handleSaveEdit} variant="primary" size="sm">
                  Sauvegarder
                </Button>
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="ghost" 
                  size="sm"
                >
                  Annuler
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Section Item Component
const SectionItem: React.FC<{
  section: any;
  onEdit: (node: any) => void;
}> = ({ section, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass p-4 rounded-xl border ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-neutral-400 hover:text-neutral-300"
          >
            ⋮⋮
          </div>
          <h4 className="font-medium text-neutral-100">
            {section.title}
          </h4>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit({ ...section, type: 'section' })}
            variant="ghost"
            size="sm"
          >
            ✏️
          </Button>
          <Button variant="ghost" size="sm">
            🗑️
          </Button>
        </div>
      </div>
      
      {/* Chapters would be rendered here */}
      {section.chapters && section.chapters.length > 0 && (
        <div className="mt-3 ml-6 space-y-2">
          {section.chapters.map((chapter: any) => (
            <div key={chapter.id} className="text-sm text-neutral-400">
              📖 {chapter.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Builder;
