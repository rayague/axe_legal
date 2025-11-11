import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { getProcessSteps, addProcessStep, updateProcessStep, deleteProcessStep } from '@/lib/firebaseApi';

interface ProcessStep {
  id?: string;
  title: string;
  description: string;
  order: number;
}

export default function ProcessManagementPage() {
  const { toast } = useToast();

  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);
  const [formData, setFormData] = useState<Partial<ProcessStep>>({
    title: '',
    description: '',
    order: 1,
  });

  const fetchSteps = async () => {
    try {
      const data = await getProcessSteps();
      setSteps(data as ProcessStep[]);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les étapes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSteps = steps.filter((step) =>
    step.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProcessStep(formData as Omit<ProcessStep, 'id'>);
      toast({ title: 'Succès', description: 'Étape ajoutée avec succès' });
      setCreateDialogOpen(false);
      resetForm();
      fetchSteps();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible d\'ajouter l\'étape', variant: 'destructive' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStep) return;

    try {
      await updateProcessStep(selectedStep.id!, formData);
      toast({ title: 'Succès', description: 'Étape modifiée avec succès' });
      setEditDialogOpen(false);
      resetForm();
      fetchSteps();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de modifier l\'étape', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette étape ?')) return;

    try {
      await deleteProcessStep(id);
      setSteps((prev) => prev.filter((s) => s.id !== id));
      toast({ title: 'Succès', description: 'Étape supprimée avec succès' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer l\'étape', variant: 'destructive' });
    }
  };

  const openEditDialog = (step: ProcessStep) => {
    setSelectedStep(step);
    setFormData({ title: step.title, description: step.description, order: step.order });
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', order: 1 });
    setSelectedStep(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion du Processus</h1>
        <p className="text-muted-foreground">Gérez les étapes de votre processus</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une étape..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une étape
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredSteps.map((step) => (
          <Card key={step.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {step.order}
                  </div>
                  <h3 className="font-bold text-lg">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(step)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(step.id!)}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter une étape</DialogTitle>
            <DialogDescription>Ajoutez une nouvelle étape au processus</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label>Ordre</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'étape</DialogTitle>
            <DialogDescription>Modifiez l'étape du processus</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label>Ordre</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
