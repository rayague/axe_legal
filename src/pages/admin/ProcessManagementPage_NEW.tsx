import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  GripVertical,
  Phone,
  MessageSquare,
  FileText,
  Scale,
  CheckCircle,
  Users,
  Clock,
  Shield,
  Target,
  Award,
  TrendingUp,
  Sparkles,
  Calendar,
  Mail,
  Send,
  FileCheck,
  Gavel,
  Building,
  Briefcase,
  LucideIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { getProcessSteps, addProcessStep, updateProcessStep, deleteProcessStep } from '@/lib/firebaseApi';

interface ProcessStep {
  id?: string;
  title: string;
  description: string;
  order: number;
  icon?: string;
  duration?: string;
  color?: string;
  details?: string[];
  isActive?: boolean;
}

// Icônes disponibles avec leurs noms
const availableIcons: { name: string; icon: LucideIcon; label: string }[] = [
  { name: 'Phone', icon: Phone, label: 'Téléphone' },
  { name: 'MessageSquare', icon: MessageSquare, label: 'Message' },
  { name: 'Mail', icon: Mail, label: 'Email' },
  { name: 'FileText', icon: FileText, label: 'Document' },
  { name: 'FileCheck', icon: FileCheck, label: 'Document vérifié' },
  { name: 'Scale', icon: Scale, label: 'Balance (Justice)' },
  { name: 'Gavel', icon: Gavel, label: 'Marteau (Juge)' },
  { name: 'CheckCircle', icon: CheckCircle, label: 'Validation' },
  { name: 'Users', icon: Users, label: 'Utilisateurs' },
  { name: 'Clock', icon: Clock, label: 'Horloge' },
  { name: 'Shield', icon: Shield, label: 'Bouclier' },
  { name: 'Target', icon: Target, label: 'Cible' },
  { name: 'Award', icon: Award, label: 'Récompense' },
  { name: 'TrendingUp', icon: TrendingUp, label: 'Tendance' },
  { name: 'Sparkles', icon: Sparkles, label: 'Étoiles' },
  { name: 'Calendar', icon: Calendar, label: 'Calendrier' },
  { name: 'Send', icon: Send, label: 'Envoyer' },
  { name: 'Building', icon: Building, label: 'Immeuble' },
  { name: 'Briefcase', icon: Briefcase, label: 'Mallette' },
];

// Couleurs disponibles
const availableColors: { value: string; label: string; gradient: string }[] = [
  { value: 'blue', label: 'Bleu', gradient: 'from-blue-500/10 to-blue-600/10' },
  { value: 'purple', label: 'Violet', gradient: 'from-purple-500/10 to-purple-600/10' },
  { value: 'green', label: 'Vert', gradient: 'from-green-500/10 to-green-600/10' },
  { value: 'orange', label: 'Orange', gradient: 'from-orange-500/10 to-orange-600/10' },
  { value: 'teal', label: 'Turquoise', gradient: 'from-teal-500/10 to-teal-600/10' },
  { value: 'pink', label: 'Rose', gradient: 'from-pink-500/10 to-pink-600/10' },
  { value: 'red', label: 'Rouge', gradient: 'from-red-500/10 to-red-600/10' },
  { value: 'yellow', label: 'Jaune', gradient: 'from-yellow-500/10 to-yellow-600/10' },
  { value: 'indigo', label: 'Indigo', gradient: 'from-indigo-500/10 to-indigo-600/10' },
  { value: 'cyan', label: 'Cyan', gradient: 'from-cyan-500/10 to-cyan-600/10' },
];

export default function ProcessManagementPage() {
  const { toast } = useToast();

  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);
  const [detailInput, setDetailInput] = useState('');
  const [formData, setFormData] = useState<Partial<ProcessStep>>({
    title: '',
    description: '',
    order: 1,
    icon: 'Phone',
    duration: '24h',
    color: 'blue',
    details: [],
    isActive: true,
  });

  const fetchSteps = async () => {
    try {
      console.log('🔍 Chargement des étapes du processus...');
      const data = await getProcessSteps();
      console.log('✅ Données reçues:', data);
      setSteps(data as ProcessStep[]);
    } catch (error) {
      console.error('❌ Erreur:', error);
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
  }, []);

  const filteredSteps = steps
    .filter((step) => step.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.order - b.order);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Firestore n'accepte pas les champs `undefined`
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([, value]) => value !== undefined)
      ) as Omit<ProcessStep, 'id'>;

      await addProcessStep(payload);
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
      // Firestore n'accepte pas les champs `undefined`
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([, value]) => value !== undefined)
      ) as Partial<ProcessStep>;

      await updateProcessStep(selectedStep.id!, payload);
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

  const handleToggleActive = async (step: ProcessStep) => {
    try {
      await updateProcessStep(step.id!, { isActive: !step.isActive });
      setSteps((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, isActive: !s.isActive } : s))
      );
      toast({ 
        title: 'Succès', 
        description: step.isActive ? 'Étape masquée' : 'Étape affichée' 
      });
    } catch (error) {
      toast({ 
        title: 'Erreur', 
        description: 'Impossible de modifier la visibilité', 
        variant: 'destructive' 
      });
    }
  };

  const handleMoveStep = async (step: ProcessStep, direction: 'up' | 'down') => {
    const currentIndex = filteredSteps.findIndex(s => s.id === step.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === filteredSteps.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const otherStep = filteredSteps[newIndex];

    try {
      await updateProcessStep(step.id!, { order: otherStep.order });
      await updateProcessStep(otherStep.id!, { order: step.order });
      fetchSteps();
      toast({ title: 'Succès', description: 'Ordre modifié' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de réorganiser', variant: 'destructive' });
    }
  };

  const openEditDialog = (step: ProcessStep) => {
    setSelectedStep(step);
    setFormData({ 
      title: step.title, 
      description: step.description, 
      order: step.order,
      icon: step.icon || 'Phone',
      duration: step.duration || '24h',
      color: step.color || 'blue',
      details: step.details || [],
      isActive: step.isActive !== false,
    });
    setEditDialogOpen(true);
  };

  const openPreviewDialog = (step: ProcessStep) => {
    setSelectedStep(step);
    setPreviewDialogOpen(true);
  };

  const addDetail = () => {
    if (detailInput.trim()) {
      setFormData({
        ...formData,
        details: [...(formData.details || []), detailInput.trim()],
      });
      setDetailInput('');
    }
  };

  const removeDetail = (index: number) => {
    setFormData({
      ...formData,
      details: formData.details?.filter((_, i) => i !== index) || [],
    });
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      order: steps.length + 1,
      icon: 'Phone',
      duration: '24h',
      color: 'blue',
      details: [],
      isActive: true,
    });
    setSelectedStep(null);
    setDetailInput('');
  };

  const getIconComponent = (iconName?: string): LucideIcon => {
    const icon = availableIcons.find(i => i.name === iconName);
    return icon ? icon.icon : Phone;
  };

  const getColorGradient = (colorName?: string): string => {
    const color = availableColors.find(c => c.value === colorName);
    return color ? color.gradient : 'from-blue-500/10 to-blue-600/10';
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
        <p className="text-muted-foreground">Gérez les étapes de votre processus client avec un contrôle complet</p>
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
        <Button onClick={() => {
          setFormData({ ...formData, order: steps.length + 1 });
          setCreateDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une étape
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredSteps.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchQuery ? (
                <>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Aucune étape trouvée</p>
                  <p className="text-sm">Essayez un autre terme de recherche</p>
                </>
              ) : (
                <>
                  <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Aucune étape de processus</p>
                  <p className="text-sm mb-4">Commencez par ajouter votre première étape</p>
                  <Button onClick={() => {
                    setFormData({ ...formData, order: 1 });
                    setCreateDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une étape
                  </Button>
                </>
              )}
            </div>
          </Card>
        ) : (
          filteredSteps.map((step, index) => {
            const IconComponent = getIconComponent(step.icon);
            const gradient = getColorGradient(step.color);
            
            return (
              <Card key={step.id} className={`group hover:shadow-lg transition-all ${step.isActive === false ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Drag Handle */}
                    <div className="flex flex-col gap-1 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleMoveStep(step, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleMoveStep(step, 'down')}
                        disabled={index === filteredSteps.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Icon & Order */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center border-2 border-primary/20`}>
                          <IconComponent className="h-7 w-7 text-primary" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                          {step.order}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{step.title}</h3>
                            {step.isActive === false && (
                              <Badge variant="secondary" className="text-xs">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Masqué
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{step.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {step.duration && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.duration}
                          </Badge>
                        )}
                        {step.details && step.details.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {step.details.length} détail{step.details.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {step.icon && (
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {availableIcons.find(i => i.name === step.icon)?.label || step.icon}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(step)}
                        title={step.isActive === false ? 'Afficher' : 'Masquer'}
                      >
                        {step.isActive === false ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openPreviewDialog(step)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(step)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(step.id!)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={createDialogOpen || editDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setCreateDialogOpen(false);
          setEditDialogOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedStep ? 'Modifier l\'étape' : 'Ajouter une étape'}</DialogTitle>
            <DialogDescription>
              {selectedStep ? 'Modifiez les informations de l\'étape' : 'Ajoutez une nouvelle étape au processus'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            <form onSubmit={selectedStep ? handleUpdate : handleCreate} className="space-y-6">
              {/* Ordre et Visibilité */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Ordre d'affichage *</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Position dans la liste</p>
                </div>
                <div>
                  <Label htmlFor="isActive">Visibilité</Label>
                  <Select
                    value={formData.isActive ? 'true' : 'false'}
                    onValueChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}
                  >
                    <SelectTrigger id="isActive">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Visible
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div className="flex items-center gap-2">
                          <EyeOff className="h-4 w-4" />
                          Masqué
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Titre */}
              <div>
                <Label htmlFor="title">Titre de l'étape *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Premier Contact"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Décrivez cette étape en détail..."
                  required
                />
              </div>

              {/* Icône et Couleur */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icône</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData({ ...formData, icon: value })}
                  >
                    <SelectTrigger id="icon">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {availableIcons.map(({ name, icon: Icon, label }) => (
                        <SelectItem key={name} value={name}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color">Couleur</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                  >
                    <SelectTrigger id="color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColors.map(({ value, label, gradient }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${gradient} border border-gray-300`} />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Durée */}
              <div>
                <Label htmlFor="duration">Durée estimée</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Ex: 24h, 2-3 jours, 1h, Variable..."
                />
                <p className="text-xs text-muted-foreground mt-1">Temps moyen pour cette étape</p>
              </div>

              {/* Détails (Points clés) */}
              <div>
                <Label>Points clés (optionnel)</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex gap-2">
                    <Input
                      value={detailInput}
                      onChange={(e) => setDetailInput(e.target.value)}
                      placeholder="Ajoutez un point clé..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addDetail();
                        }
                      }}
                    />
                    <Button type="button" onClick={addDetail} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.details && formData.details.length > 0 && (
                    <div className="space-y-2">
                      {formData.details.map((detail, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="flex-1 text-sm">{detail}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDetail(index)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Liste à puces qui sera affichée dans la carte</p>
              </div>

              {/* Preview */}
              <div>
                <Label>Aperçu</Label>
                <Card className={`mt-2 p-4 bg-gradient-to-br ${getColorGradient(formData.color)} border-2 border-primary/20`}>
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getColorGradient(formData.color)} flex items-center justify-center border-2 border-primary/30`}>
                        {(() => {
                          const Icon = getIconComponent(formData.icon);
                          return <Icon className="h-6 w-6 text-primary" />;
                        })()}
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                        {formData.order}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {formData.duration && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {formData.duration}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-bold mb-1">{formData.title || 'Titre de l\'étape'}</h4>
                      <p className="text-sm text-muted-foreground">{formData.description || 'Description de l\'étape...'}</p>
                      {formData.details && formData.details.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {formData.details.slice(0, 3).map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                          {formData.details.length > 3 && (
                            <li className="text-xs text-muted-foreground ml-5">
                              +{formData.details.length - 3} autre{formData.details.length - 3 > 1 ? 's' : ''}...
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              <DialogFooter className="gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setCreateDialogOpen(false);
                    setEditDialogOpen(false);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {selectedStep ? 'Enregistrer les modifications' : 'Ajouter l\'étape'}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Aperçu de l'étape</DialogTitle>
            <DialogDescription>Aperçu tel qu'il sera affiché sur la page publique</DialogDescription>
          </DialogHeader>
          {selectedStep && (() => {
            const Icon = getIconComponent(selectedStep.icon);
            const gradient = getColorGradient(selectedStep.color);
            
            return (
              <Card className={`p-6 bg-gradient-to-br ${gradient} border-2 border-primary/20`}>
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center border-4 border-background shadow-lg`}>
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md">
                      {selectedStep.order}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      {selectedStep.duration && (
                        <Badge className="mb-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {selectedStep.duration}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{selectedStep.title}</h3>
                    <p className="text-muted-foreground mb-4">{selectedStep.description}</p>
                    {selectedStep.details && selectedStep.details.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <div className="h-1 w-8 bg-primary rounded"></div>
                          Points Clés
                        </h4>
                        <ul className="space-y-2">
                          {selectedStep.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                              <div className="mt-1 flex-shrink-0">
                                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                                  <CheckCircle className="h-3 w-3 text-primary" />
                                </div>
                              </div>
                              <span className="text-muted-foreground flex-1">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
