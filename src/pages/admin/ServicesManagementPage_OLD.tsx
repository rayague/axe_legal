import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getServices, addService, updateService, deleteService } from '@/lib/firebaseApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  FileText,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  createdAt?: Date;
}

const AVAILABLE_ICONS = [
  'Scale',
  'Building',
  'Users',
  'FileText',
  'Briefcase',
  'Home',
  'TrendingUp',
  'Shield',
  'BookOpen',
  'Gavel',
  'Heart',
  'Globe',
  'DollarSign',
  'UserCheck',
  'Award',
];

const CATEGORIES = [
  'Droit des affaires',
  'Droit fiscal',
  'Droit immobilier',
  'Droit du travail',
  'Droit de la famille',
  'Droit pénal',
  'Droit administratif',
  'Contentieux',
  'Conseil juridique',
];

export default function ServicesManagementPage() {
  const { toast } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    icon: 'Briefcase',
  });

  // Charger les services
  const fetchServices = async () => {
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

  useEffect(() => {
    fetchServices();
  }, []);

  // Générer un slug à partir du titre
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Filtrer les services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      searchQuery === '' ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && service.isActive) ||
      (filterStatus === 'inactive' && !service.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Créer un service
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur lors de la création');

      toast({
        title: 'Service créé',
        description: 'Le service a été créé avec succès',
      });

      setCreateDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le service',
        variant: 'destructive',
      });
    }
  };

  // Modifier un service
  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      const response = await fetch(`http://localhost:4000/api/admin/services/${selectedService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur lors de la modification');

      toast({
        title: 'Service modifié',
        description: 'Le service a été modifié avec succès',
      });

      setEditDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le service',
        variant: 'destructive',
      });
    }
  };

  // Supprimer un service
  const deleteService = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer ce service ?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erreur');

      setServices((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: 'Service supprimé',
        description: 'Le service a été supprimé avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le service',
        variant: 'destructive',
      });
    }
  };

  // Toggle actif/inactif
  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/services/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) throw new Error('Erreur');

      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !isActive } : s))
      );

      toast({
        title: isActive ? 'Service désactivé' : 'Service activé',
        description: `Le service est maintenant ${!isActive ? 'visible' : 'masqué'} sur le site`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut',
        variant: 'destructive',
      });
    }
  };

  // Ouvrir le dialog d'édition
  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      icon: service.icon,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      features: service.features,
      benefits: service.benefits,
      category: service.category,
      price: service.price,
      duration: service.duration,
      isActive: service.isActive,
      order: service.order,
      metadata: service.metadata || { seoTitle: '', seoDescription: '', keywords: [] },
    });
    setEditDialogOpen(true);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      icon: 'Briefcase',
      shortDescription: '',
      fullDescription: '',
      features: [],
      benefits: [],
      category: '',
      price: '',
      duration: '',
      isActive: true,
      order: 0,
      metadata: {
        seoTitle: '',
        seoDescription: '',
        keywords: [],
      },
    });
    setFeatureInput('');
    setBenefitInput('');
    setKeywordInput('');
    setSelectedService(null);
  };

  // Ajouter une fonctionnalité
  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  // Ajouter un avantage
  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData({
        ...formData,
        benefits: [...(formData.benefits || []), benefitInput.trim()],
      });
      setBenefitInput('');
    }
  };

  // Ajouter un mot-clé
  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData({
        ...formData,
        metadata: {
          ...formData.metadata,
          keywords: [...(formData.metadata?.keywords || []), keywordInput.trim()],
        },
      });
      setKeywordInput('');
    }
  };

  // Supprimer un élément d'une liste
  const removeFromList = (list: 'features' | 'benefits' | 'keywords', index: number) => {
    if (list === 'keywords') {
      const newKeywords = [...(formData.metadata?.keywords || [])];
      newKeywords.splice(index, 1);
      setFormData({
        ...formData,
        metadata: { ...formData.metadata, keywords: newKeywords },
      });
    } else {
      const newList = [...(formData[list] || [])];
      newList.splice(index, 1);
      setFormData({ ...formData, [list]: newList });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Services</h1>
          <p className="text-gray-600 mt-1">
            Gérez les services affichés sur la page publique /services
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau service
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-3xl font-bold text-blue-900">{services.length}</p>
            </div>
            <Briefcase className="h-10 w-10 text-blue-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Actifs</p>
              <p className="text-3xl font-bold text-green-900">
                {services.filter((s) => s.isActive).length}
              </p>
            </div>
            <Eye className="h-10 w-10 text-green-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Inactifs</p>
              <p className="text-3xl font-bold text-orange-900">
                {services.filter((s) => !s.isActive).length}
              </p>
            </div>
            <EyeOff className="h-10 w-10 text-orange-600 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Catégories</p>
              <p className="text-3xl font-bold text-purple-900">
                {new Set(services.map((s) => s.category)).size}
              </p>
            </div>
            <FileText className="h-10 w-10 text-purple-600 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher un service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun service trouvé</h3>
            <p className="text-gray-600">
              {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Aucun service ne correspond à vos critères de recherche'
                : 'Commencez par créer votre premier service'}
            </p>
          </Card>
        ) : (
          filteredServices.map((service) => (
            <Card
              key={service.id}
              className={`p-6 hover:shadow-lg transition-shadow ${
                !service.isActive ? 'opacity-60 bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.title}</h3>
                    <Badge variant="outline" className="mt-1">
                      {service.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {service.isActive ? (
                    <Badge className="bg-green-100 text-green-800">Actif</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {service.shortDescription}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                {service.price && <span>💰 {service.price}</span>}
                {service.duration && <span>⏱️ {service.duration}</span>}
                {service.features && (
                  <span>✨ {service.features.length} fonctionnalités</span>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedService(service);
                    setViewDialogOpen(true);
                  }}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(service)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(service.id, service.isActive)}
                >
                  {service.isActive ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteService(service.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        open={createDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editDialogOpen ? 'Modifier le service' : 'Créer un nouveau service'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du service. Les champs marqués d'un * sont obligatoires.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={editDialogOpen ? handleUpdateService : handleCreateService} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informations de base</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Titre du service *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({
                        ...formData,
                        title,
                        slug: generateSlug(title),
                      });
                    }}
                    placeholder="Ex: Droit des affaires"
                    required
                  />
                </div>

                <div>
                  <Label>Slug (URL) *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="droit-des-affaires"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Icône</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) =>
                      setFormData({ ...formData, icon: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_ICONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description courte *</Label>
                <Textarea
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  placeholder="Brève description affichée sur la carte du service (1-2 phrases)"
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label>Description complète *</Label>
                <Textarea
                  value={formData.fullDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, fullDescription: e.target.value })
                  }
                  placeholder="Description détaillée du service"
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Prix</Label>
                  <Input
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="Ex: Sur devis, 150€/h"
                  />
                </div>

                <div>
                  <Label>Durée</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="Ex: 1h, 2-3 semaines"
                  />
                </div>

                <div>
                  <Label>Ordre d'affichage</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label>Service actif (visible sur le site)</Label>
              </div>
            </div>

            {/* Fonctionnalités */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Fonctionnalités</h3>
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Ajouter une fonctionnalité"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button type="button" onClick={addFeature}>
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features?.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeFromList('features', index)}
                  >
                    {feature} ✕
                  </Badge>
                ))}
              </div>
            </div>

            {/* Avantages */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Avantages</h3>
              <div className="flex gap-2">
                <Input
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  placeholder="Ajouter un avantage"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addBenefit();
                    }
                  }}
                />
                <Button type="button" onClick={addBenefit}>
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.benefits?.map((benefit, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeFromList('benefits', index)}
                  >
                    {benefit} ✕
                  </Badge>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Référencement (SEO)</h3>
              
              <div>
                <Label>Titre SEO</Label>
                <Input
                  value={formData.metadata?.seoTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, seoTitle: e.target.value },
                    })
                  }
                  placeholder="Titre pour les moteurs de recherche"
                />
              </div>

              <div>
                <Label>Description SEO</Label>
                <Textarea
                  value={formData.metadata?.seoDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, seoDescription: e.target.value },
                    })
                  }
                  placeholder="Description pour les moteurs de recherche"
                  rows={2}
                />
              </div>

              <div>
                <Label>Mots-clés SEO</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Ajouter un mot-clé"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                  />
                  <Button type="button" onClick={addKeyword}>
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.metadata?.keywords?.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeFromList('keywords', index)}
                    >
                      {keyword} ✕
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
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
                {editDialogOpen ? 'Modifier' : 'Créer'} le service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {selectedService?.title}
            </DialogTitle>
            <DialogDescription>Détails complets du service</DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Catégorie</Label>
                  <p className="font-medium">{selectedService.category}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Statut</Label>
                  <Badge className={selectedService.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {selectedService.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Prix</Label>
                  <p className="font-medium">{selectedService.price || 'Non défini'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Durée</Label>
                  <p className="font-medium">{selectedService.duration || 'Non défini'}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Description courte</Label>
                <p className="text-sm mt-1">{selectedService.shortDescription}</p>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Description complète</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{selectedService.fullDescription}</p>
              </div>

              {selectedService.features && selectedService.features.length > 0 && (
                <div>
                  <Label className="text-xs text-gray-500">Fonctionnalités</Label>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {selectedService.features.map((feature, index) => (
                      <li key={index} className="text-sm">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedService.benefits && selectedService.benefits.length > 0 && (
                <div>
                  <Label className="text-xs text-gray-500">Avantages</Label>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {selectedService.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <Label className="text-xs text-gray-500">Créé le</Label>
                  <p>{new Date(selectedService.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                {selectedService.updatedAt && (
                  <div>
                    <Label className="text-xs text-gray-500">Modifié le</Label>
                    <p>{new Date(selectedService.updatedAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
