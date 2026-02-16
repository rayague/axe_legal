import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getServices, addService, updateService, deleteService, type Service } from '@/lib/firebaseApi';
import { pickLocalizedString } from '@/lib/i18nFields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Briefcase, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ServicesManagementPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [editingLang, setEditingLang] = useState<'fr' | 'en'>('fr');

  const getFr = (field: any): string => pickLocalizedString(field, 'fr');
  const getLangValue = (field: any, lang: 'fr' | 'en'): string => pickLocalizedString(field, lang);
  const toLocalized = (nextValue: string, existing: any, lang: 'fr' | 'en') => {
    const base = existing && typeof existing === 'object' && existing !== null ? existing : { fr: '', en: '' };
    const prevFr = typeof base.fr === 'string' ? base.fr : '';
    const prevEn = typeof base.en === 'string' ? base.en : '';
    const fr = lang === 'fr' ? nextValue : (prevFr || nextValue);
    const en = lang === 'en' ? nextValue : (prevEn || nextValue);
    return { fr, en };
  };
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    icon: 'Briefcase',
    features: [''],
    benefits: [''],
    pricing: '',
    duration: '',
    order: 0,
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    loadServices();
  }, []);

  const hydrateFormFromService = (service: Service, lang: 'fr' | 'en') => {
    setFormData({
      title: getLangValue(service.title, lang),
      slug: service.slug || '',
      description: getLangValue(service.description, lang),
      icon: service.icon || 'Briefcase',
      features:
        service.features && service.features.length > 0
          ? (service.features as any[]).map((f) => getLangValue(f, lang))
          : [''],
      benefits:
        service.benefits && service.benefits.length > 0
          ? (service.benefits as any[]).map((b) => getLangValue(b, lang))
          : [''],
      pricing: service.pricing ? getLangValue(service.pricing, lang) : '',
      duration: service.duration ? getLangValue(service.duration, lang) : '',
      order: service.order || 0,
      metaTitle: service.metaTitle ? getLangValue(service.metaTitle, lang) : '',
      metaDescription: service.metaDescription ? getLangValue(service.metaDescription, lang) : '',
    });
  };

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const existing = editingService;
      const cleanedFeatures = formData.features.filter(f => f.trim() !== '');
      const cleanedBenefits = formData.benefits.filter(b => b.trim() !== '');

      const serviceDataRaw = {
        ...formData,
        title: toLocalized(formData.title, existing?.title, editingLang),
        description: toLocalized(formData.description, existing?.description, editingLang),
        pricing: formData.pricing ? toLocalized(formData.pricing, existing?.pricing, editingLang) : undefined,
        duration: formData.duration ? toLocalized(formData.duration, existing?.duration, editingLang) : undefined,
        metaTitle: formData.metaTitle ? toLocalized(formData.metaTitle, existing?.metaTitle, editingLang) : undefined,
        metaDescription: formData.metaDescription ? toLocalized(formData.metaDescription, existing?.metaDescription, editingLang) : undefined,
        features: cleanedFeatures.map((f, idx) => toLocalized(f, (existing?.features as any)?.[idx], editingLang)),
        benefits: cleanedBenefits.map((b, idx) => toLocalized(b, (existing?.benefits as any)?.[idx], editingLang)),
        slug:
          formData.slug ||
          formData.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[éèê]/g, 'e')
            .replace(/[àâ]/g, 'a'),
      };

      // Firestore n'accepte pas les champs `undefined`
      const serviceData = Object.fromEntries(
        Object.entries(serviceDataRaw).filter(([, value]) => value !== undefined)
      );

      if (editingService) {
        await updateService(editingService.id!, serviceData);
        toast({ title: 'Succès', description: 'Service modifié avec succès' });
      } else {
        await addService(serviceData);
        toast({ title: 'Succès', description: 'Service ajouté avec succès' });
      }
      setDialogOpen(false);
      resetForm();
      loadServices();
    } catch (error) {
      const errAny = error as any;
      const code = typeof errAny?.code === 'string' ? errAny.code : undefined;
      const name = typeof errAny?.name === 'string' ? errAny.name : undefined;
      const message = error instanceof Error ? error.message : String(error);

      console.error('Erreur sauvegarde service:', {
        code,
        name,
        message,
        error,
      });

      const detail = [code, name, message].filter(Boolean).join(' | ');
      toast({
        title: 'Erreur',
        description: `Impossible de sauvegarder le service${detail ? `: ${detail}` : ''}`,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    hydrateFormFromService(service, editingLang);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
    try {
      await deleteService(id!);
      toast({ title: 'Succès', description: 'Service supprimé avec succès' });
      loadServices();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le service',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      icon: 'Briefcase',
      features: [''],
      benefits: [''],
      pricing: '',
      duration: '',
      order: 0,
      metaTitle: '',
      metaDescription: '',
    });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ''] });
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Services</h1>
          <p className="text-muted-foreground">Gérez les services juridiques proposés</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Service
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{getFr(service.title)}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-2">{getFr(service.description)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                {service.features && service.features.length > 0 && (
                  <p className="text-muted-foreground">
                    {service.features.length} fonctionnalité{service.features.length > 1 ? 's' : ''}
                  </p>
                )}
                {service.benefits && service.benefits.length > 0 && (
                  <p className="text-muted-foreground">
                    {service.benefits.length} avantage{service.benefits.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Modifier le service' : 'Nouveau service'}
            </DialogTitle>
            <DialogDescription>
              Remplissez tous les détails du service juridique
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Langue</Label>
                <Select
                  value={editingLang}
                  onValueChange={(value) => {
                    const lang = value === 'en' ? 'en' : 'fr';
                    setEditingLang(lang);
                    if (editingService) hydrateFormFromService(editingService, lang);
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

              {/* Informations de base */}
              <div className="grid gap-2">
                <Label htmlFor="title">Titre du service *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Droit des Affaires"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Description détaillée du service..."
                />
              </div>

              {/* Fonctionnalités */}
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label>Fonctionnalités</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-1" /> Ajouter
                  </Button>
                </div>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Ex: Création et immatriculation de sociétés"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Avantages */}
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label>Avantages</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                    <Plus className="h-4 w-4 mr-1" /> Ajouter
                  </Button>
                </div>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      placeholder="Ex: Sécurisation juridique complète"
                    />
                    {formData.benefits.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="pricing">Tarif</Label>
                  <Input
                    id="pricing"
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    placeholder="Ex: Sur devis"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Durée</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Ex: Variable selon le projet"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="droit-des-affaires"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="order">Ordre d'affichage</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Référencement (SEO)</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="Titre pour les moteurs de recherche"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      rows={2}
                      placeholder="Description pour les moteurs de recherche"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingService ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
