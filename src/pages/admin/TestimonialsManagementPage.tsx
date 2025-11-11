import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle,
  Star,
  MessageSquare,
  User
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Testimonial {
  id: number;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  clientImage: string;
  rating: number;
  testimonial: string;
  caseType: string;
  date: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function TestimonialsManagementPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    clientName: "",
    clientRole: "",
    clientCompany: "",
    clientImage: "",
    rating: 5,
    testimonial: "",
    caseType: "",
    date: new Date().toISOString().split('T')[0],
    isActive: true,
    isFeatured: false,
    order: 0,
  });

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials, searchTerm, statusFilter, ratingFilter]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/testimonials', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch testimonials');

      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les témoignages",
        variant: "destructive",
      });
    }
  };

  const filterTestimonials = () => {
    let filtered = [...testimonials];

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.testimonial.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter === "active") {
      filtered = filtered.filter((t) => t.isActive);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((t) => !t.isActive);
    } else if (statusFilter === "featured") {
      filtered = filtered.filter((t) => t.isFeatured);
    }

    if (ratingFilter !== "all") {
      filtered = filtered.filter((t) => t.rating === parseInt(ratingFilter));
    }

    setFilteredTestimonials(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = selectedTestimonial
        ? `http://localhost:4000/api/admin/testimonials/${selectedTestimonial.id}`
        : 'http://localhost:4000/api/admin/testimonials';

      const method = selectedTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save testimonial');

      toast({
        title: "Succès",
        description: selectedTestimonial 
          ? "Témoignage modifié avec succès" 
          : "Nouveau témoignage créé avec succès",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le témoignage",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) return;

    try {
      const response = await fetch(`http://localhost:4000/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete testimonial');

      toast({
        title: "Succès",
        description: "Témoignage supprimé avec succès",
      });

      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le témoignage",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/testimonials/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error('Failed to toggle testimonial status');

      toast({
        title: "Succès",
        description: `Témoignage ${!currentStatus ? 'activé' : 'désactivé'} avec succès`,
      });

      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling testimonial:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/testimonials/${id}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });

      if (!response.ok) throw new Error('Failed to toggle featured status');

      toast({
        title: "Succès",
        description: `Témoignage ${!currentStatus ? 'mis en avant' : 'retiré de la mise en avant'}`,
      });

      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de mise en avant",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData({
      clientName: testimonial.clientName,
      clientRole: testimonial.clientRole,
      clientCompany: testimonial.clientCompany,
      clientImage: testimonial.clientImage,
      rating: testimonial.rating,
      testimonial: testimonial.testimonial,
      caseType: testimonial.caseType,
      date: testimonial.date,
      isActive: testimonial.isActive,
      isFeatured: testimonial.isFeatured,
      order: testimonial.order,
    });
    setIsDialogOpen(true);
  };

  const openViewDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsViewDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedTestimonial(null);
    setFormData({
      clientName: "",
      clientRole: "",
      clientCompany: "",
      clientImage: "",
      rating: 5,
      testimonial: "",
      caseType: "",
      date: new Date().toISOString().split('T')[0],
      isActive: true,
      isFeatured: false,
      order: 0,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const stats = {
    total: testimonials.length,
    active: testimonials.filter((t) => t.isActive).length,
    inactive: testimonials.filter((t) => !t.isActive).length,
    featured: testimonials.filter((t) => t.isFeatured).length,
    averageRating: testimonials.length > 0
      ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
      : "0.0",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Témoignages</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les témoignages clients affichés sur le site
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Témoignage
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inactive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Avant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.featured}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Note Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating} ⭐</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, entreprise, type de dossier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs uniquement</SelectItem>
                <SelectItem value="inactive">Inactifs uniquement</SelectItem>
                <SelectItem value="featured">En avant uniquement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les notes</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ (5 étoiles)</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ (4 étoiles)</SelectItem>
                <SelectItem value="3">⭐⭐⭐ (3 étoiles)</SelectItem>
                <SelectItem value="2">⭐⭐ (2 étoiles)</SelectItem>
                <SelectItem value="1">⭐ (1 étoile)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <div className="grid gap-4">
        {filteredTestimonials.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Aucun témoignage trouvé
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {testimonial.clientImage ? (
                        <img
                          src={testimonial.clientImage}
                          alt={testimonial.clientName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{testimonial.clientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.clientRole} • {testimonial.clientCompany}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                          {testimonial.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactif
                            </>
                          )}
                        </Badge>
                        {testimonial.isFeatured && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                            ⭐ En Avant
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      "{testimonial.testimonial}"
                    </p>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <Badge variant="outline">{testimonial.caseType}</Badge>
                      <span>📅 {new Date(testimonial.date).toLocaleDateString('fr-FR')}</span>
                      <span>📊 Ordre: {testimonial.order}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewDialog(testimonial)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(testimonial)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant={testimonial.isFeatured ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleToggleFeatured(testimonial.id, testimonial.isFeatured)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {testimonial.isFeatured ? "Retirer" : "Mettre en avant"}
                    </Button>
                    <Button
                      variant={testimonial.isActive ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleToggleActive(testimonial.id, testimonial.isActive)}
                    >
                      {testimonial.isActive ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activer
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTestimonial ? "Modifier le témoignage" : "Nouveau témoignage"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du témoignage client
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nom du client *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Jean Dupont"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientRole">Fonction *</Label>
                <Input
                  id="clientRole"
                  value={formData.clientRole}
                  onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                  placeholder="Directeur Général"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientCompany">Entreprise *</Label>
              <Input
                id="clientCompany"
                value={formData.clientCompany}
                onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                placeholder="ABC Corporation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientImage">URL de la photo</Label>
              <Input
                id="clientImage"
                value={formData.clientImage}
                onChange={(e) => setFormData({ ...formData, clientImage: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonial">Témoignage *</Label>
              <Textarea
                id="testimonial"
                value={formData.testimonial}
                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                placeholder="Votre témoignage complet..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caseType">Type de dossier *</Label>
                <Input
                  id="caseType"
                  value={formData.caseType}
                  onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                  placeholder="Droit des affaires"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Note (1-5) *</Label>
                <Select 
                  value={formData.rating.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ (5 étoiles)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ (4 étoiles)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ (3 étoiles)</SelectItem>
                    <SelectItem value="2">⭐⭐ (2 étoiles)</SelectItem>
                    <SelectItem value="1">⭐ (1 étoile)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Ordre d'affichage</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Témoignage actif
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">
                  Mettre en avant
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : selectedTestimonial ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du témoignage</DialogTitle>
          </DialogHeader>
          {selectedTestimonial && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {selectedTestimonial.clientImage ? (
                  <img
                    src={selectedTestimonial.clientImage}
                    alt={selectedTestimonial.clientName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedTestimonial.clientName}</h3>
                  <p className="text-muted-foreground">
                    {selectedTestimonial.clientRole} • {selectedTestimonial.clientCompany}
                  </p>
                  <div className="mt-2">
                    {renderStars(selectedTestimonial.rating)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Témoignage</Label>
                <p className="text-muted-foreground italic">"{selectedTestimonial.testimonial}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de dossier</Label>
                  <p className="text-muted-foreground">{selectedTestimonial.caseType}</p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p className="text-muted-foreground">
                    {new Date(selectedTestimonial.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Statut</Label>
                  <div className="mt-1 flex gap-2">
                    <Badge variant={selectedTestimonial.isActive ? "default" : "secondary"}>
                      {selectedTestimonial.isActive ? "Actif" : "Inactif"}
                    </Badge>
                    {selectedTestimonial.isFeatured && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        ⭐ En Avant
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Ordre</Label>
                  <p className="text-muted-foreground">{selectedTestimonial.order}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
