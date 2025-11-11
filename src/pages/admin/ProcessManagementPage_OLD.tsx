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
  Clock,
  ListOrdered,
  FileText
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProcessStep {
  id: number;
  number: string;
  title: string;
  description: string;
  details: string[];
  duration: string;
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

const iconOptions = [
  { value: "Phone", label: "Téléphone" },
  { value: "MessageSquare", label: "Message" },
  { value: "FileText", label: "Document" },
  { value: "Scale", label: "Balance" },
  { value: "CheckCircle", label: "Validation" },
  { value: "Users", label: "Utilisateurs" },
  { value: "Clock", label: "Horloge" },
  { value: "Shield", label: "Bouclier" },
  { value: "Target", label: "Cible" },
  { value: "Award", label: "Récompense" },
];

const colorOptions = [
  { value: "from-blue-500/10 to-blue-600/10", label: "Bleu" },
  { value: "from-purple-500/10 to-purple-600/10", label: "Violet" },
  { value: "from-green-500/10 to-green-600/10", label: "Vert" },
  { value: "from-orange-500/10 to-orange-600/10", label: "Orange" },
  { value: "from-teal-500/10 to-teal-600/10", label: "Turquoise" },
  { value: "from-red-500/10 to-red-600/10", label: "Rouge" },
  { value: "from-yellow-500/10 to-yellow-600/10", label: "Jaune" },
  { value: "from-pink-500/10 to-pink-600/10", label: "Rose" },
];

export default function ProcessManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [processes, setProcesses] = useState<ProcessStep[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<ProcessStep[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<ProcessStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    number: "",
    title: "",
    description: "",
    details: [""],
    duration: "",
    icon: "Phone",
    color: "from-blue-500/10 to-blue-600/10",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchProcesses();
  }, []);

  useEffect(() => {
    filterProcesses();
  }, [processes, searchTerm, statusFilter]);

  const fetchProcesses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/admin/processes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch processes');

      const data = await response.json();
      setProcesses(data.processes || []);
    } catch (error) {
      console.error('Error fetching processes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les étapes du processus",
        variant: "destructive",
      });
    }
  };

  const filterProcesses = () => {
    let filtered = [...processes];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter === "active") {
      filtered = filtered.filter((p) => p.isActive);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((p) => !p.isActive);
    }

    setFilteredProcesses(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = selectedProcess
        ? `http://localhost:4000/api/admin/processes/${selectedProcess.id}`
        : 'http://localhost:4000/api/admin/processes';

      const method = selectedProcess ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save process');

      toast({
        title: "Succès",
        description: selectedProcess 
          ? "Étape du processus modifiée avec succès" 
          : "Nouvelle étape créée avec succès",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchProcesses();
    } catch (error) {
      console.error('Error saving process:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'étape",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette étape ?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/admin/processes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete process');

      toast({
        title: "Succès",
        description: "Étape supprimée avec succès",
      });

      fetchProcesses();
    } catch (error) {
      console.error('Error deleting process:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'étape",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/admin/processes/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error('Failed to toggle process status');

      toast({
        title: "Succès",
        description: `Étape ${!currentStatus ? 'activée' : 'désactivée'} avec succès`,
      });

      fetchProcesses();
    } catch (error) {
      console.error('Error toggling process:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (process: ProcessStep) => {
    setSelectedProcess(process);
    setFormData({
      number: process.number,
      title: process.title,
      description: process.description,
      details: process.details,
      duration: process.duration,
      icon: process.icon,
      color: process.color,
      isActive: process.isActive,
      order: process.order,
    });
    setIsDialogOpen(true);
  };

  const openViewDialog = (process: ProcessStep) => {
    setSelectedProcess(process);
    setIsViewDialogOpen(true);
  };

  const resetForm = () => {
    setSelectedProcess(null);
    setFormData({
      number: "",
      title: "",
      description: "",
      details: [""],
      duration: "",
      icon: "Phone",
      color: "from-blue-500/10 to-blue-600/10",
      isActive: true,
      order: 0,
    });
  };

  const addDetailField = () => {
    setFormData({ ...formData, details: [...formData.details, ""] });
  };

  const removeDetailField = (index: number) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails });
  };

  const updateDetailField = (index: number, value: string) => {
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const stats = {
    total: processes.length,
    active: processes.filter((p) => p.isActive).length,
    inactive: processes.filter((p) => !p.isActive).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion du Processus</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les étapes du processus d'accompagnement
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Étape
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Étapes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inactive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre, description ou numéro..."
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
                <SelectItem value="active">Actives uniquement</SelectItem>
                <SelectItem value="inactive">Inactives uniquement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Processes List */}
      <div className="grid gap-4">
        {filteredProcesses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Aucune étape trouvée
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredProcesses.map((process) => (
            <Card key={process.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono">
                        {process.number}
                      </Badge>
                      <h3 className="text-lg font-semibold">{process.title}</h3>
                      <Badge variant={process.isActive ? "default" : "secondary"}>
                        {process.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{process.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {process.duration}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ListOrdered className="h-4 w-4" />
                        Ordre: {process.order}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        {process.details.length} détails
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openViewDialog(process)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(process)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant={process.isActive ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleToggleActive(process.id, process.isActive)}
                    >
                      {process.isActive ? (
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
                      onClick={() => handleDelete(process.id)}
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
              {selectedProcess ? "Modifier l'étape" : "Nouvelle étape du processus"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de l'étape
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Numéro *</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Ordre d'affichage *</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Premier Contact"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de l'étape..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durée *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="24h"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icône</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Couleur</Label>
                <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Détails de l'étape</Label>
                <Button type="button" variant="outline" size="sm" onClick={addDetailField}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un détail
                </Button>
              </div>
              {formData.details.map((detail, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={detail}
                    onChange={(e) => updateDetailField(index, e.target.value)}
                    placeholder="Détail de l'étape..."
                  />
                  {formData.details.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeDetailField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Étape active
              </Label>
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
                {isLoading ? "Enregistrement..." : selectedProcess ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'étape</DialogTitle>
          </DialogHeader>
          {selectedProcess && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-mono text-lg">
                  {selectedProcess.number}
                </Badge>
                <h3 className="text-xl font-bold">{selectedProcess.title}</h3>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-muted-foreground">{selectedProcess.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Durée</Label>
                  <p className="text-muted-foreground">{selectedProcess.duration}</p>
                </div>
                <div>
                  <Label>Ordre</Label>
                  <p className="text-muted-foreground">{selectedProcess.order}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Icône</Label>
                  <p className="text-muted-foreground">{selectedProcess.icon}</p>
                </div>
                <div>
                  <Label>Couleur</Label>
                  <div className={`h-8 rounded ${selectedProcess.color} border`}></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Détails</Label>
                <ul className="list-disc list-inside space-y-1">
                  {selectedProcess.details.map((detail, index) => (
                    <li key={index} className="text-muted-foreground">{detail}</li>
                  ))}
                </ul>
              </div>

              <div>
                <Label>Statut</Label>
                <div className="mt-1">
                  <Badge variant={selectedProcess.isActive ? "default" : "secondary"}>
                    {selectedProcess.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
