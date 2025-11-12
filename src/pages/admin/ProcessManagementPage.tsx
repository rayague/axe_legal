import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X, 
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
  GitBranch,
  Zap,
  Heart,
  Star,
  AlertCircle,
  Info
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getProcessSteps,
  addProcessStep,
  updateProcessStep,
  deleteProcessStep,
  ProcessStep
} from "@/lib/firebaseApi";

// Interface enrichie pour l'affichage
interface EnrichedProcessStep extends ProcessStep {
  iconName?: string;
  duration?: string;
  details?: string[];
  color?: string;
}

// Liste des icônes disponibles
const availableIcons = [
  { name: "Phone", icon: Phone, label: "Téléphone" },
  { name: "MessageSquare", icon: MessageSquare, label: "Message" },
  { name: "FileText", icon: FileText, label: "Document" },
  { name: "Scale", icon: Scale, label: "Balance (Justice)" },
  { name: "CheckCircle", icon: CheckCircle, label: "Validation" },
  { name: "Users", icon: Users, label: "Équipe" },
  { name: "Clock", icon: Clock, label: "Horloge" },
  { name: "Shield", icon: Shield, label: "Protection" },
  { name: "Target", icon: Target, label: "Cible" },
  { name: "Award", icon: Award, label: "Récompense" },
  { name: "TrendingUp", icon: TrendingUp, label: "Croissance" },
  { name: "Sparkles", icon: Sparkles, label: "Étincelles" },
  { name: "GitBranch", icon: GitBranch, label: "Branche" },
  { name: "Zap", icon: Zap, label: "Éclair" },
  { name: "Heart", icon: Heart, label: "Cœur" },
  { name: "Star", icon: Star, label: "Étoile" },
];

// Liste des couleurs disponibles
const availableColors = [
  { value: "from-blue-500/10 to-blue-600/10", label: "Bleu", preview: "bg-blue-500" },
  { value: "from-purple-500/10 to-purple-600/10", label: "Violet", preview: "bg-purple-500" },
  { value: "from-green-500/10 to-green-600/10", label: "Vert", preview: "bg-green-500" },
  { value: "from-orange-500/10 to-orange-600/10", label: "Orange", preview: "bg-orange-500" },
  { value: "from-teal-500/10 to-teal-600/10", label: "Sarcelle", preview: "bg-teal-500" },
  { value: "from-pink-500/10 to-pink-600/10", label: "Rose", preview: "bg-pink-500" },
  { value: "from-red-500/10 to-red-600/10", label: "Rouge", preview: "bg-red-500" },
  { value: "from-yellow-500/10 to-yellow-600/10", label: "Jaune", preview: "bg-yellow-500" },
  { value: "from-indigo-500/10 to-indigo-600/10", label: "Indigo", preview: "bg-indigo-500" },
  { value: "from-cyan-500/10 to-cyan-600/10", label: "Cyan", preview: "bg-cyan-500" },
];

export default function ProcessManagementPage() {
  const [steps, setSteps] = useState<EnrichedProcessStep[]>([]);
  const [filteredSteps, setFilteredSteps] = useState<EnrichedProcessStep[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingStep, setEditingStep] = useState<EnrichedProcessStep | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stepToDelete, setStepToDelete] = useState<EnrichedProcessStep | null>(null);
  
  const { toast } = useToast();

  // État du formulaire
  const [formData, setFormData] = useState<EnrichedProcessStep>({
    title: "",
    description: "",
    order: 1,
    iconName: "Phone",
    duration: "24h",
    details: [],
    color: "from-blue-500/10 to-blue-600/10"
  });

  const [currentDetail, setCurrentDetail] = useState("");

  useEffect(() => {
    fetchSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = steps.filter(step =>
      step.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      step.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSteps(filtered);
  }, [searchTerm, steps]);

  const fetchSteps = async () => {
    try {
      setIsLoading(true);
      const data = await getProcessSteps();
      console.log('📊 Étapes récupérées:', data);
      setSteps(data as EnrichedProcessStep[]);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les étapes du processus",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (step: EnrichedProcessStep) => {
    setEditingStep(step);
    setFormData({
      ...step,
      details: step.details || []
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    const maxOrder = steps.length > 0 ? Math.max(...steps.map(s => s.order)) : 0;
    setFormData({
      title: "",
      description: "",
      order: maxOrder + 1,
      iconName: "Phone",
      duration: "24h",
      details: [],
      color: "from-blue-500/10 to-blue-600/10"
    });
    setEditingStep(null);
    setIsAddingNew(true);
  };

  const handleCancel = () => {
    setEditingStep(null);
    setIsAddingNew(false);
    setFormData({
      title: "",
      description: "",
      order: 1,
      iconName: "Phone",
      duration: "24h",
      details: [],
      color: "from-blue-500/10 to-blue-600/10"
    });
    setCurrentDetail("");
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre et la description sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const dataToSave: EnrichedProcessStep = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        order: formData.order,
        iconName: formData.iconName,
        duration: formData.duration,
        details: formData.details?.filter(d => d.trim() !== '') || [],
        color: formData.color
      };

      if (editingStep?.id) {
        await updateProcessStep(editingStep.id, dataToSave);
        toast({
          title: "Succès",
          description: "Étape mise à jour avec succès"
        });
      } else {
        await addProcessStep(dataToSave);
        toast({
          title: "Succès",
          description: "Nouvelle étape ajoutée avec succès"
        });
      }

      await fetchSteps();
      handleCancel();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'étape",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!stepToDelete?.id) return;

    try {
      await deleteProcessStep(stepToDelete.id);
      toast({
        title: "Succès",
        description: "Étape supprimée avec succès"
      });
      await fetchSteps();
      setDeleteDialogOpen(false);
      setStepToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'étape",
        variant: "destructive"
      });
    }
  };

  const addDetail = () => {
    if (currentDetail.trim()) {
      setFormData({
        ...formData,
        details: [...(formData.details || []), currentDetail.trim()]
      });
      setCurrentDetail("");
    }
  };

  const removeDetail = (index: number) => {
    setFormData({
      ...formData,
      details: formData.details?.filter((_, i) => i !== index) || []
    });
  };

  const getIconComponent = (iconName?: string) => {
    const icon = availableIcons.find(i => i.name === iconName);
    return icon ? icon.icon : Phone;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Chargement des étapes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion du Processus</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les étapes de votre processus juridique
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une étape
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une étape..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Liste des étapes */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                Étapes du Processus ({filteredSteps.length})
              </CardTitle>
              <CardDescription>
                Cliquez sur une étape pour la modifier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {filteredSteps.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Aucune étape trouvée</p>
                    <p className="text-sm mt-2">
                      {searchTerm ? "Essayez une autre recherche" : "Ajoutez votre première étape"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSteps
                      .sort((a, b) => a.order - b.order)
                      .map((step) => {
                        const IconComponent = getIconComponent(step.iconName);
                        const isEditing = editingStep?.id === step.id;

                        return (
                          <Card
                            key={step.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              isEditing ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => handleEdit(step)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color || 'from-blue-500/10 to-blue-600/10'} flex items-center justify-center`}>
                                    <IconComponent className="h-6 w-6 text-primary" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-xs">
                                      Ordre: {step.order}
                                    </Badge>
                                    {step.duration && (
                                      <Badge variant="secondary" className="text-xs">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {step.duration}
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="font-semibold text-sm mb-1 truncate">
                                    {step.title}
                                  </h3>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {step.description}
                                  </p>
                                  {step.details && step.details.length > 0 && (
                                    <div className="mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        {step.details.length} point{step.details.length > 1 ? 's' : ''} clé{step.details.length > 1 ? 's' : ''}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(step);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setStepToDelete(step);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire d'édition */}
        {(isAddingNew || editingStep) && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingStep ? 'Modifier l\'étape' : 'Nouvelle étape'}</span>
                  <Button variant="ghost" size="icon" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Remplissez tous les champs pour créer une étape complète
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {/* Titre */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Premier Contact"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Décrivez cette étape en détail..."
                        rows={4}
                      />
                    </div>

                    {/* Ordre */}
                    <div className="space-y-2">
                      <Label htmlFor="order">Ordre d'affichage *</Label>
                      <Input
                        id="order"
                        type="number"
                        min="1"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Position de cette étape dans le processus
                      </p>
                    </div>

                    {/* Icône */}
                    <div className="space-y-2">
                      <Label>Icône</Label>
                      <Select
                        value={formData.iconName}
                        onValueChange={(value) => setFormData({ ...formData, iconName: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIcons.map((icon) => {
                            const Icon = icon.icon;
                            return (
                              <SelectItem key={icon.name} value={icon.name}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{icon.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Durée */}
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée estimée</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="Ex: 24h, 1-2 jours, Variable"
                      />
                    </div>

                    {/* Couleur */}
                    <div className="space-y-2">
                      <Label>Couleur du dégradé</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {availableColors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, color: color.value })}
                            className={`h-12 rounded-lg ${color.preview} transition-all hover:scale-110 ${
                              formData.color === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                            }`}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Points clés */}
                    <div className="space-y-2">
                      <Label>Points clés</Label>
                      <div className="space-y-2">
                        {formData.details && formData.details.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {formData.details.map((detail, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm flex-1">{detail}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeDetail(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Input
                            value={currentDetail}
                            onChange={(e) => setCurrentDetail(e.target.value)}
                            placeholder="Ajouter un point clé..."
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
                      </div>
                    </div>

                    {/* Aperçu */}
                    <div className="space-y-2 pt-4 border-t">
                      <Label>Aperçu</Label>
                      <Card className={`p-4 bg-gradient-to-br ${formData.color || 'from-blue-500/10 to-blue-600/10'}`}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {(() => {
                              const IconComponent = getIconComponent(formData.iconName);
                              return (
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                  <IconComponent className="h-6 w-6 text-primary" />
                                </div>
                              );
                            })()}
                          </div>
                          <div className="flex-1">
                            {formData.duration && (
                              <Badge variant="secondary" className="mb-2">
                                <Clock className="h-3 w-3 mr-1" />
                                {formData.duration}
                              </Badge>
                            )}
                            <h3 className="font-bold text-lg mb-2">
                              {formData.title || "Titre de l'étape"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {formData.description || "Description de l'étape"}
                            </p>
                            {formData.details && formData.details.length > 0 && (
                              <div className="space-y-1">
                                {formData.details.map((detail, i) => (
                                  <div key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>{detail}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSave} className="flex-1 gap-2">
                        <Save className="h-4 w-4" />
                        Enregistrer
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="gap-2">
                        <X className="h-4 w-4" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Message si aucune étape sélectionnée */}
        {!isAddingNew && !editingStep && (
          <div className="flex items-center justify-center h-full">
            <Card className="p-12 text-center">
              <Info className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Sélectionnez une étape</h3>
              <p className="text-muted-foreground mb-6">
                Cliquez sur une étape à gauche pour la modifier,<br />
                ou ajoutez-en une nouvelle
              </p>
              <Button onClick={handleAddNew} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une étape
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'étape "{stepToDelete?.title}" sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
