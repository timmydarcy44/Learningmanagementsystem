'use client';
import { useState, useEffect, useTransition } from 'react';
import { Users, Plus, X, BookOpen } from 'lucide-react';
import { assignToPathway, unassignFromPathway } from './actions';

interface AssignmentsPanelProps {
  formationId: string;
  orgId: string;
}

type Pathway = {
  id: string;
  title: string;
  description?: string;
};

type PathwayItem = {
  id: string;
  pathway_id: string;
  item_type: string;
  item_id: string;
  position: number;
};

export default function AssignmentsPanel({ formationId, orgId }: AssignmentsPanelProps) {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [assignedPathways, setAssignedPathways] = useState<PathwayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  // Charger les parcours et les assignations
  useEffect(() => {
    const loadData = async () => {
      try {
        // TODO: Remplacer par des appels API réels
        // Pour l'instant, on simule des données
        const mockPathways: Pathway[] = [
          { id: '1', title: 'Parcours Marketing Digital', description: 'Formation complète en marketing digital' },
          { id: '2', title: 'Parcours Management', description: 'Développement des compétences managériales' },
          { id: '3', title: 'Parcours Ventes', description: 'Techniques de vente et négociation' },
        ];

        const mockAssignments: PathwayItem[] = [
          { id: '1', pathway_id: '1', item_type: 'formation', item_id: formationId, position: 0 },
        ];

        setPathways(mockPathways);
        setAssignedPathways(mockAssignments);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [formationId]);

  const handleAssignToPathway = (pathwayId: string) => {
    startTransition(async () => {
      try {
        await assignToPathway(pathwayId, formationId);
        // Mettre à jour l'état local
        const pathway = pathways.find(p => p.id === pathwayId);
        if (pathway) {
          setAssignedPathways(prev => [...prev, {
            id: Date.now().toString(),
            pathway_id: pathwayId,
            item_type: 'formation',
            item_id: formationId,
            position: assignedPathways.length
          }]);
        }
      } catch (error) {
        console.error('Erreur lors de l\'assignation:', error);
      }
    });
  };

  const handleUnassignFromPathway = (pathwayId: string) => {
    startTransition(async () => {
      try {
        await unassignFromPathway(pathwayId, formationId);
        // Mettre à jour l'état local
        setAssignedPathways(prev => prev.filter(a => a.pathway_id !== pathwayId));
      } catch (error) {
        console.error('Erreur lors de la désassignation:', error);
      }
    });
  };

  const availablePathways = pathways.filter(p => 
    !assignedPathways.some(a => a.pathway_id === p.id)
  );

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-iris-400" />
          <h3 className="text-lg font-semibold text-iris-grad">Assignations</h3>
        </div>
        <div className="text-center text-white/50">Chargement…</div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-iris-400" />
        <h3 className="text-lg font-semibold text-iris-grad">Assignations</h3>
      </div>

      <div className="space-y-6">
        {/* Parcours assignés */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">
            <BookOpen className="h-4 w-4 inline mr-2" />
            Parcours assignés
          </h4>
          
          {assignedPathways.length === 0 ? (
            <div className="text-white/50 text-sm">Aucun parcours assigné</div>
          ) : (
            <div className="space-y-2">
              {assignedPathways.map(assignment => {
                const pathway = pathways.find(p => p.id === assignment.pathway_id);
                if (!pathway) return null;
                
                return (
                  <div key={assignment.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{pathway.title}</div>
                      {pathway.description && (
                        <div className="text-white/50 text-xs">{pathway.description}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleUnassignFromPathway(pathway.id)}
                      disabled={pending}
                      className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                      title="Retirer du parcours"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Assigner à un parcours */}
        {availablePathways.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white mb-3">
              <Plus className="h-4 w-4 inline mr-2" />
              Assigner à un parcours
            </h4>
            
            <div className="space-y-2">
              {availablePathways.map(pathway => (
                <div key={pathway.id} className="bg-white/5 rounded-lg p-3">
                  <div className="text-white text-sm font-medium mb-1">{pathway.title}</div>
                  {pathway.description && (
                    <div className="text-white/50 text-xs mb-2">{pathway.description}</div>
                  )}
                  <button
                    onClick={() => handleAssignToPathway(pathway.id)}
                    disabled={pending}
                    className="btn-cta text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Assigner
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Apprenants (placeholder) */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">
            <Users className="h-4 w-4 inline mr-2" />
            Apprenants directs
          </h4>
          <div className="text-white/50 text-sm">
            Les assignations directes aux apprenants se font via les parcours.
            <br />
            <span className="text-xs">(Fonctionnalité à venir)</span>
          </div>
        </div>

        {/* Section Groupes (placeholder) */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">
            <Users className="h-4 w-4 inline mr-2" />
            Groupes
          </h4>
          <div className="text-white/50 text-sm">
            L'assignation aux groupes se fait via les parcours.
            <br />
            <span className="text-xs">(Fonctionnalité à venir)</span>
          </div>
        </div>

        {pending && (
          <div className="text-xs text-white/50 text-center">Mise à jour en cours…</div>
        )}
      </div>
    </div>
  );
}
