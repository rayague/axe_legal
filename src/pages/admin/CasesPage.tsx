import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Folder,
  Scale
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CaseFile = {
  id: number;
  caseNumber: string;
  title: string;
  client: string;
  email: string;
  phone: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'on-hold' | 'resolved' | 'closed' | 'rejected';
  assignedTo: string;
  description: string;
  dateOpened: string;
  dateClosed?: string;
  documents: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export default function CasesPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [filteredCases, setFilteredCases] = useState<CaseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<CaseFile | null>(null);
  const [viewingCase, setViewingCase] = useState<CaseFile | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Filtres et recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    email: "",
    phone: "",
    category: "droit-affaires",
    priority: "medium" as CaseFile['priority'],
    status: "pending" as CaseFile['status'],
    assignedTo: "",
    description: "",
    notes: "",
  });

  useEffect(() => {
    fetchCases();
  }, [token]);

  useEffect(() => {
    filterCases();
  }, [cases, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const fetchCases = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/cases`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.cases) setCases(data.cases);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCases = () => {
    let filtered = [...cases];

    // Recherche textuelle
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.caseNumber.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.client.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Filtre par priorité
    if (priorityFilter !== "all") {
      filtered = filtered.filter(c => c.priority === priorityFilter);
    }

    // Filtre par catégorie
    if (categoryFilter !== "all") {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }

    setFilteredCases(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const url = editingCase
        ? `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/cases/${editingCase.id}`
        : `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/cases`;
      
      const method = editingCase ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: editingCase ? "Dossier modifié" : "Dossier créé",
          description: "L'opération a été effectuée avec succès.",
        });
        fetchCases();
        resetForm();
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (caseFile: CaseFile) => {
    setEditingCase(caseFile);
    setFormData({
      title: caseFile.title,
      client: caseFile.client,
      email: caseFile.email,
      phone: caseFile.phone,
      category: caseFile.category,
      priority: caseFile.priority,
      status: caseFile.status,
      assignedTo: caseFile.assignedTo,
      description: caseFile.description,
      notes: caseFile.notes,
    });
    setIsDialogOpen(true);
  };

  const handleView = (caseFile: CaseFile) => {
    setViewingCase(caseFile);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/cases/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Dossier supprimé",
        description: "Le dossier a été supprimé avec succès.",
      });
      fetchCases();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le dossier.",
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (id: number, status: CaseFile['status']) => {
    if (!token) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/cases/${id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      setCases(cases.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c));
      toast({
        title: "Statut mis à jour",
        description: "Le statut du dossier a été modifié.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      client: "",
      email: "",
      phone: "",
      category: "droit-affaires",
      priority: "medium",
      status: "pending",
      assignedTo: "",
      description: "",
      notes: "",
    });
    setEditingCase(null);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
  };

  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
    'in-progress': { label: 'En cours', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: AlertCircle },
    'on-hold': { label: 'En pause', color: 'bg-orange-100 text-orange-800 border-orange-300', icon: AlertCircle },
    resolved: { label: 'Résolu', color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
    closed: { label: 'Fermé', color: 'bg-gray-100 text-gray-800 border-gray-300', icon: CheckCircle },
    rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
  };

  const priorityConfig = {
    low: { label: 'Basse', color: 'bg-gray-100 text-gray-800' },
    medium: { label: 'Moyenne', color: 'bg-blue-100 text-blue-800' },
    high: { label: 'Haute', color: 'bg-orange-100 text-orange-800' },
    urgent: { label: 'Urgente', color: 'bg-red-100 text-red-800' },
  };

  const categories = [
    { value: 'droit-affaires', label: 'Droit des Affaires' },
    { value: 'fiscalite', label: 'Fiscalité' },
    { value: 'immobilier', label: 'Droit Immobilier' },
    { value: 'travail', label: 'Droit du Travail' },
    { value: 'recouvrement', label: 'Recouvrement' },
    { value: 'marches-publics', label: 'Marchés Publics' },
    { value: 'famille', label: 'Droit de la Famille' },
    { value: 'penal', label: 'Droit Pénal' },
    { value: 'autre', label: 'Autre' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Folder className="h-8 w-8 text-primary" />
            Gestion des Dossiers
          </h2>
          <p className="text-muted-foreground mt-1">
            Gérez tous les dossiers juridiques de vos clients
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchCases} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Dossier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCase ? "Modifier le dossier" : "Nouveau dossier"}
                </DialogTitle>
                <DialogDescription>
                  Remplissez les informations du dossier juridique
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Titre du dossier *</Label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Litige commercial avec ABC Corp"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Nom du client *</Label>
                    <Input
                      required
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="Nom complet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemple.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+229 XX XX XX XX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Catégorie *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priorité *</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value as CaseFile['priority'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Statut *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as CaseFile['status'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="in-progress">En cours</SelectItem>
                        <SelectItem value="on-hold">En pause</SelectItem>
                        <SelectItem value="resolved">Résolu</SelectItem>
                        <SelectItem value="closed">Fermé</SelectItem>
                        <SelectItem value="rejected">Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Assigné à</Label>
                    <Input
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      placeholder="Nom de l'avocat"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Description *</Label>
                    <Textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description détaillée du dossier..."
                      rows={4}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Notes internes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Notes pour usage interne..."
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingCase ? "Modifier" : "Créer"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{cases.length}</p>
              </div>
              <Folder className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {cases.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold text-blue-600">
                  {cases.filter(c => c.status === 'in-progress').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Résolus</p>
                <p className="text-2xl font-bold text-green-600">
                  {cases.filter(c => c.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgents</p>
                <p className="text-2xl font-bold text-red-600">
                  {cases.filter(c => c.priority === 'urgent').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fermés</p>
                <p className="text-2xl font-bold text-gray-600">
                  {cases.filter(c => c.status === 'closed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Recherche et Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 space-y-2">
              <Label>Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="N° dossier, client, titre..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="on-hold">En pause</SelectItem>
                  <SelectItem value="resolved">Résolu</SelectItem>
                  <SelectItem value="closed">Fermé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchQuery || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredCases.length} résultat{filteredCases.length > 1 ? 's' : ''} trouvé{filteredCases.length > 1 ? 's' : ''}
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cases List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Dossiers</CardTitle>
          <CardDescription>
            {filteredCases.length} dossier{filteredCases.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Chargement...</p>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all"
                  ? "Aucun dossier ne correspond à vos critères"
                  : "Aucun dossier pour le moment"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCases.map((caseFile) => {
                const StatusIcon = statusConfig[caseFile.status].icon;
                return (
                  <Card key={caseFile.id} className="border-l-4 hover:shadow-md transition-shadow" style={{
                    borderLeftColor: caseFile.priority === 'urgent' ? '#ef4444' : caseFile.priority === 'high' ? '#f97316' : '#3b82f6'
                  }}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded">
                              <Scale className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h3 className="font-bold text-lg">{caseFile.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  #{caseFile.caseNumber}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <Badge className={statusConfig[caseFile.status].color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig[caseFile.status].label}
                                </Badge>
                                <Badge className={priorityConfig[caseFile.priority].color}>
                                  {priorityConfig[caseFile.priority].label}
                                </Badge>
                                <Badge variant="outline">
                                  {categories.find(c => c.value === caseFile.category)?.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span><strong>Client:</strong> {caseFile.client}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <a href={`mailto:${caseFile.email}`} className="hover:text-primary truncate">
                                {caseFile.email}
                              </a>
                            </div>
                            {caseFile.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <a href={`tel:${caseFile.phone}`} className="hover:text-primary">
                                  {caseFile.phone}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Ouvert: {new Date(caseFile.dateOpened).toLocaleDateString('fr-FR')}</span>
                            </div>
                            {caseFile.assignedTo && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span><strong>Assigné à:</strong> {caseFile.assignedTo}</span>
                              </div>
                            )}
                          </div>

                          <div className="text-sm text-muted-foreground border-t pt-2">
                            <p className="line-clamp-2">{caseFile.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(caseFile)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {caseFile.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateStatus(caseFile.id, 'in-progress')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Démarrer
                            </Button>
                          )}
                          {caseFile.status === 'in-progress' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateStatus(caseFile.id, 'resolved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Résoudre
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(caseFile)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(caseFile.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewingCase && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Détails du Dossier #{viewingCase.caseNumber}
                </DialogTitle>
                <DialogDescription>
                  Informations complètes du dossier
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-xl mb-2">{viewingCase.title}</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={statusConfig[viewingCase.status].color}>
                      {statusConfig[viewingCase.status].label}
                    </Badge>
                    <Badge className={priorityConfig[viewingCase.priority].color}>
                      Priorité: {priorityConfig[viewingCase.priority].label}
                    </Badge>
                    <Badge variant="outline">
                      {categories.find(c => c.value === viewingCase.category)?.label}
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-semibold">{viewingCase.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{viewingCase.email}</p>
                  </div>
                  {viewingCase.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-semibold">{viewingCase.phone}</p>
                    </div>
                  )}
                  {viewingCase.assignedTo && (
                    <div>
                      <p className="text-sm text-muted-foreground">Assigné à</p>
                      <p className="font-semibold">{viewingCase.assignedTo}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'ouverture</p>
                    <p className="font-semibold">{new Date(viewingCase.dateOpened).toLocaleDateString('fr-FR')}</p>
                  </div>
                  {viewingCase.dateClosed && (
                    <div>
                      <p className="text-sm text-muted-foreground">Date de fermeture</p>
                      <p className="font-semibold">{new Date(viewingCase.dateClosed).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="whitespace-pre-wrap">{viewingCase.description}</p>
                </div>

                {viewingCase.notes && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Notes internes</p>
                    <p className="whitespace-pre-wrap bg-muted p-3 rounded">{viewingCase.notes}</p>
                  </div>
                )}

                <div className="border-t pt-4 text-xs text-muted-foreground">
                  <p>Créé le: {new Date(viewingCase.createdAt).toLocaleString('fr-FR')}</p>
                  <p>Dernière modification: {new Date(viewingCase.updatedAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEdit(viewingCase);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
