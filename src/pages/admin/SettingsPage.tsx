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
  Scale,
  Heart,
  Home,
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Car,
  Building,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  EyeOff
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
import { Switch } from "@/components/ui/switch";
import {
  getLegalCategories,
  addLegalCategory,
  updateLegalCategory,
  deleteLegalCategory,
  LegalCategory,
  LegalCategoryStep
} from "@/lib/firebaseApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pickLocalizedString } from "@/lib/i18nFields";

// Liste des icônes disponibles
const availableIcons = [
  { name: "Heart", icon: Heart, label: "Cœur (Famille)" },
  { name: "Home", icon: Home, label: "Maison (Immobilier)" },
  { name: "Briefcase", icon: Briefcase, label: "Mallette (Affaires)" },
  { name: "Users", icon: Users, label: "Utilisateurs (Travail)" },
  { name: "FileText", icon: FileText, label: "Document (Contrats)" },
  { name: "TrendingUp", icon: TrendingUp, label: "Graphique (Succession)" },
  { name: "Car", icon: Car, label: "Voiture (Accidents)" },
  { name: "Building", icon: Building, label: "Bâtiment (Construction)" },
  { name: "CreditCard", icon: CreditCard, label: "Carte (Créances)" },
  { name: "Scale", icon: Scale, label: "Balance (Justice)" },
];

// Liste des couleurs disponibles
const availableColors = [
  { value: "from-pink-500/10 to-pink-600/10", label: "Rose", borderColor: "hover:border-pink-500/50", preview: "bg-pink-500" },
  { value: "from-blue-500/10 to-blue-600/10", label: "Bleu", borderColor: "hover:border-blue-500/50", preview: "bg-blue-500" },
  { value: "from-purple-500/10 to-purple-600/10", label: "Violet", borderColor: "hover:border-purple-500/50", preview: "bg-purple-500" },
  { value: "from-green-500/10 to-green-600/10", label: "Vert", borderColor: "hover:border-green-500/50", preview: "bg-green-500" },
  { value: "from-orange-500/10 to-orange-600/10", label: "Orange", borderColor: "hover:border-orange-500/50", preview: "bg-orange-500" },
  { value: "from-yellow-500/10 to-yellow-600/10", label: "Jaune", borderColor: "hover:border-yellow-500/50", preview: "bg-yellow-500" },
  { value: "from-red-500/10 to-red-600/10", label: "Rouge", borderColor: "hover:border-red-500/50", preview: "bg-red-500" },
  { value: "from-teal-500/10 to-teal-600/10", label: "Sarcelle", borderColor: "hover:border-teal-500/50", preview: "bg-teal-500" },
  { value: "from-indigo-500/10 to-indigo-600/10", label: "Indigo", borderColor: "hover:border-indigo-500/50", preview: "bg-indigo-500" },
  { value: "from-cyan-500/10 to-cyan-600/10", label: "Cyan", borderColor: "hover:border-cyan-500/50", preview: "bg-cyan-500" },
];

export default function SettingsPage() {
  const [categories, setCategories] = useState<LegalCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<LegalCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<LegalCategory | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<LegalCategory | null>(null);

  const [editingLang, setEditingLang] = useState<'fr' | 'en'>('fr');
  
  const { toast } = useToast();

  const getLangValue = (field: any, lang: 'fr' | 'en'): string => pickLocalizedString(field, lang);
  const toLocalized = (nextValue: string, existing: any, lang: 'fr' | 'en') => {
    const base = existing && typeof existing === 'object' && existing !== null ? existing : { fr: '', en: '' };
    const prevFr = typeof base.fr === 'string' ? base.fr : '';
    const prevEn = typeof base.en === 'string' ? base.en : '';
    const fr = lang === 'fr' ? nextValue : (prevFr || nextValue);
    const en = lang === 'en' ? nextValue : (prevEn || nextValue);
    return { fr, en };
  };

  // État du formulaire
  const [formData, setFormData] = useState<Partial<LegalCategory>>({
    categoryId: "",
    iconName: "Scale",
    title: "",
    description: "",
    color: "from-blue-500/10 to-blue-600/10",
    borderColor: "hover:border-blue-500/50",
    order: 1,
    guidanceTitle: "",
    steps: [],
    documents: [],
    timeline: "",
    cost: "",
    warning: "",
    isActive: true
  });

  const [currentStep, setCurrentStep] = useState<LegalCategoryStep>({ title: "", description: "" });
  const [currentDocument, setCurrentDocument] = useState("");

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = categories.filter(cat =>
      getLangValue(cat.title, 'fr').toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLangValue(cat.description, 'fr').toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.categoryId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getLegalCategories();
      setCategories(data);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories juridiques",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: LegalCategory) => {
    setEditingCategory(category);
    setFormData({
      ...category,
      title: getLangValue(category.title, editingLang),
      description: getLangValue(category.description, editingLang),
      guidanceTitle: getLangValue(category.guidanceTitle, editingLang),
      timeline: getLangValue(category.timeline, editingLang),
      cost: getLangValue(category.cost, editingLang),
      warning: getLangValue(category.warning, editingLang),
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) : 0;
    setFormData({
      categoryId: "",
      iconName: "Scale",
      title: "",
      description: "",
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "hover:border-blue-500/50",
      order: maxOrder + 1,
      guidanceTitle: "",
      steps: [],
      documents: [],
      timeline: "",
      cost: "",
      warning: "",
      isActive: true
    });
    setEditingCategory(null);
    setIsAddingNew(true);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setIsAddingNew(false);
    setFormData({
      categoryId: "",
      iconName: "Scale",
      title: "",
      description: "",
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "hover:border-blue-500/50",
      order: 1,
      guidanceTitle: "",
      steps: [],
      documents: [],
      timeline: "",
      cost: "",
      warning: "",
      isActive: true
    });
    setCurrentStep({ title: "", description: "" });
    setCurrentDocument("");
  };

  const handleSave = async () => {
    if (!formData.categoryId?.trim() || !formData.title?.trim() || !formData.description?.trim()) {
      toast({
        title: "Erreur",
        description: "L'ID, le titre et la description sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const dataToSave: Omit<LegalCategory, 'id'> = {
        categoryId: formData.categoryId.trim(),
        iconName: formData.iconName || "Scale",
        title: toLocalized(formData.title.trim(), editingCategory?.title, editingLang) as any,
        description: toLocalized(formData.description.trim(), editingCategory?.description, editingLang) as any,
        color: formData.color || "from-blue-500/10 to-blue-600/10",
        borderColor: formData.borderColor || "hover:border-blue-500/50",
        order: formData.order || 1,
        guidanceTitle: toLocalized(
          (formData.guidanceTitle?.trim() || formData.title.trim()),
          editingCategory?.guidanceTitle,
          editingLang
        ) as any,
        steps: (formData.steps || []).map((step: any, idx: number) => {
          const existingStep = editingCategory?.steps?.[idx];
          return {
            ...step,
            title: toLocalized(getLangValue(step.title, editingLang), existingStep?.title, editingLang),
            description: toLocalized(getLangValue(step.description, editingLang), existingStep?.description, editingLang),
          };
        }) as any,
        documents: formData.documents || [],
        timeline: toLocalized((formData.timeline?.trim() || ""), editingCategory?.timeline, editingLang) as any,
        cost: toLocalized((formData.cost?.trim() || ""), editingCategory?.cost, editingLang) as any,
        warning: toLocalized((formData.warning?.trim() || ""), editingCategory?.warning, editingLang) as any,
        isActive: formData.isActive ?? true
      };

      if (editingCategory?.id) {
        await updateLegalCategory(editingCategory.id, dataToSave);
        toast({
          title: "Succès",
          description: "Catégorie mise à jour avec succès"
        });
      } else {
        await addLegalCategory(dataToSave);
        toast({
          title: "Succès",
          description: "Nouvelle catégorie ajoutée avec succès"
        });
      }

      await fetchCategories();
      handleCancel();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la catégorie",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete?.id) return;

    try {
      await deleteLegalCategory(categoryToDelete.id);
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès"
      });
      await fetchCategories();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive"
      });
    }
  };

  const addStep = () => {
    if (currentStep.title.trim() && currentStep.description.trim()) {
      const stepToAdd: any = {
        title: toLocalized(currentStep.title.trim(), undefined, editingLang),
        description: toLocalized(currentStep.description.trim(), undefined, editingLang)
      };
      setFormData({
        ...formData,
        steps: [...(formData.steps || []), stepToAdd]
      });
      setCurrentStep({ title: "", description: "" });
    }
  };

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps?.filter((_, i) => i !== index) || []
    });
  };

  const addDocument = () => {
    if (currentDocument.trim()) {
      setFormData({
        ...formData,
        documents: [...(formData.documents || []), currentDocument.trim()]
      });
      setCurrentDocument("");
    }
  };

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documents: formData.documents?.filter((_, i) => i !== index) || []
    });
  };

  const getIconComponent = (iconName?: string) => {
    const icon = availableIcons.find(i => i.name === iconName);
    return icon ? icon.icon : Scale;
  };

  const handleColorChange = (colorValue: string) => {
    const colorConfig = availableColors.find(c => c.value === colorValue);
    if (colorConfig) {
      setFormData({
        ...formData,
        color: colorConfig.value,
        borderColor: colorConfig.borderColor
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Chargement des paramètres...</p>
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
          <h1 className="text-3xl font-bold">Paramètres LegalTech</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les catégories juridiques et leurs démarches
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une catégorie
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Catégories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Catégories Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {categories.filter(c => c.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Catégories Inactives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {categories.filter(c => !c.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Liste des catégories */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Catégories Juridiques ({filteredCategories.length})
              </CardTitle>
              <CardDescription>
                Cliquez sur une catégorie pour la modifier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[700px] pr-4">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Aucune catégorie trouvée</p>
                    <p className="text-sm mt-2">
                      {searchTerm ? "Essayez une autre recherche" : "Ajoutez votre première catégorie"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredCategories
                      .sort((a, b) => a.order - b.order)
                      .map((category) => {
                        const IconComponent = getIconComponent(category.iconName);
                        const isEditing = editingCategory?.id === category.id;

                        return (
                          <Card
                            key={category.id}
                            className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${category.borderColor} ${
                              isEditing ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => handleEdit(category)}
                          >
                            <CardContent className="p-0">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                                    <IconComponent className="h-6 w-6 text-primary" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <Badge variant="outline" className="text-xs">
                                      {category.categoryId}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Ordre: {category.order}
                                    </Badge>
                                    {category.isActive ? (
                                      <Badge variant="default" className="text-xs bg-green-600">
                                        <Eye className="h-3 w-3 mr-1" />
                                        Actif
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="text-xs">
                                        <EyeOff className="h-3 w-3 mr-1" />
                                        Inactif
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="font-semibold text-sm mb-1 truncate">
                                    {getLangValue(category.title, 'fr')}
                                  </h3>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {getLangValue(category.description, 'fr')}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {category.steps && category.steps.length > 0 && (
                                      <Badge variant="outline" className="text-xs">
                                        {category.steps.length} étapes
                                      </Badge>
                                    )}
                                    {category.documents && category.documents.length > 0 && (
                                      <Badge variant="outline" className="text-xs">
                                        {category.documents.length} documents
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(category);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCategoryToDelete(category);
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
        {(isAddingNew || editingCategory) ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</span>
                  <Button variant="ghost" size="icon" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Remplissez tous les champs pour créer une catégorie complète
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label>Langue</Label>
                  <Select
                    value={editingLang}
                    onValueChange={(value) => {
                      const lang = value === 'en' ? 'en' : 'fr';
                      setEditingLang(lang);

                      if (editingCategory) {
                        setFormData((prev) => ({
                          ...prev,
                          title: getLangValue(editingCategory.title, lang),
                          description: getLangValue(editingCategory.description, lang),
                          guidanceTitle: getLangValue(editingCategory.guidanceTitle, lang),
                          timeline: getLangValue(editingCategory.timeline, lang),
                          cost: getLangValue(editingCategory.cost, lang),
                          warning: getLangValue(editingCategory.warning, lang),
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">FR</SelectItem>
                      <SelectItem value="en">EN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basique</TabsTrigger>
                    <TabsTrigger value="steps">Étapes</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                  <ScrollArea className="h-[600px] mt-4 pr-4">
                    <TabsContent value="basic" className="space-y-4">
                      {/* ID Catégorie */}
                      <div className="space-y-2">
                        <Label htmlFor="categoryId">ID de la catégorie *</Label>
                        <Input
                          id="categoryId"
                          value={formData.categoryId}
                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                          placeholder="Ex: family, real-estate, business"
                        />
                        <p className="text-xs text-muted-foreground">
                          Identifiant unique (lettres minuscules et tirets)
                        </p>
                      </div>

                      {/* Titre */}
                      <div className="space-y-2">
                        <Label htmlFor="title">Titre *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Ex: Droit de la Famille"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">Description courte *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Description courte qui apparaît sur la carte"
                          rows={2}
                        />
                      </div>

                      {/* Titre du guide */}
                      <div className="space-y-2">
                        <Label htmlFor="guidanceTitle">Titre du guide détaillé</Label>
                        <Input
                          id="guidanceTitle"
                          value={formData.guidanceTitle}
                          onChange={(e) => setFormData({ ...formData, guidanceTitle: e.target.value })}
                          placeholder="Ex: Divorce et Droit de la Famille"
                        />
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

                      {/* Couleur */}
                      <div className="space-y-2">
                        <Label>Couleur</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {availableColors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => handleColorChange(color.value)}
                              className={`h-12 rounded-lg ${color.preview} transition-all hover:scale-110 ${
                                formData.color === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                              }`}
                              title={color.label}
                            />
                          ))}
                        </div>
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
                      </div>

                      {/* Timeline */}
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Délai estimé</Label>
                        <Input
                          id="timeline"
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          placeholder="Ex: 6 à 18 mois selon la complexité"
                        />
                      </div>

                      {/* Coût */}
                      <div className="space-y-2">
                        <Label htmlFor="cost">Coût indicatif</Label>
                        <Input
                          id="cost"
                          value={formData.cost}
                          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                          placeholder="Ex: Variable selon le type de divorce"
                        />
                      </div>

                      {/* Avertissement */}
                      <div className="space-y-2">
                        <Label htmlFor="warning">Point d'attention</Label>
                        <Textarea
                          id="warning"
                          value={formData.warning}
                          onChange={(e) => setFormData({ ...formData, warning: e.target.value })}
                          placeholder="Avertissement ou point important à noter"
                          rows={2}
                        />
                      </div>

                      {/* Active */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label>Catégorie active</Label>
                          <p className="text-sm text-muted-foreground">
                            La catégorie sera visible sur le site public
                          </p>
                        </div>
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="steps" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Étapes de la procédure ({formData.steps?.length || 0})</Label>
                        </div>

                        {/* Liste des étapes */}
                        {formData.steps && formData.steps.length > 0 && (
                          <div className="space-y-3 mb-4">
                            {formData.steps.map((step, index) => (
                              <Card key={index} className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm mb-1">{getLangValue((step as any).title, editingLang)}</h4>
                                    <p className="text-xs text-muted-foreground">{getLangValue((step as any).description, editingLang)}</p>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeStep(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* Ajouter une étape */}
                        <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                          <Label>Ajouter une étape</Label>
                          <Input
                            value={currentStep.title}
                            onChange={(e) => setCurrentStep({ ...currentStep, title: e.target.value })}
                            placeholder="Titre de l'étape (ex: 1. Consultation juridique initiale)"
                          />
                          <Textarea
                            value={currentStep.description}
                            onChange={(e) => setCurrentStep({ ...currentStep, description: e.target.value })}
                            placeholder="Description détaillée de l'étape..."
                            rows={3}
                          />
                          <Button type="button" onClick={addStep} variant="outline" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter cette étape
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Documents à préparer ({formData.documents?.length || 0})</Label>
                        </div>

                        {/* Liste des documents */}
                        {formData.documents && formData.documents.length > 0 && (
                          <div className="grid md:grid-cols-2 gap-2 mb-4">
                            {formData.documents.map((doc, index) => (
                              <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm flex-1 truncate">{doc}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeDocument(index)}
                                  className="h-7 w-7"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Ajouter un document */}
                        <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                          <Label>Ajouter un document</Label>
                          <div className="flex gap-2">
                            <Input
                              value={currentDocument}
                              onChange={(e) => setCurrentDocument(e.target.value)}
                              placeholder="Ex: Acte de mariage"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addDocument();
                                }
                              }}
                            />
                            <Button type="button" onClick={addDocument} variant="outline">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </Tabs>

                {/* Boutons d'action */}
                <div className="flex gap-2 mt-6 pt-6 border-t">
                  <Button onClick={handleSave} className="flex-1 gap-2">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="gap-2">
                    <X className="h-4 w-4" />
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="p-12 text-center">
              <Info className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Sélectionnez une catégorie</h3>
              <p className="text-muted-foreground mb-6">
                Cliquez sur une catégorie à gauche pour la modifier,<br />
                ou ajoutez-en une nouvelle
              </p>
              <Button onClick={handleAddNew} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une catégorie
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
              Cette action est irréversible. La catégorie "{categoryToDelete?.title}" sera définitivement supprimée.
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
