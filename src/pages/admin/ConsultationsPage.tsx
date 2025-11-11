import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getConsultations, updateConsultation } from '@/lib/firebaseApi';

interface Consultation {
  id?: string;
  name: string;
  email: string;
  phone: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: Date;
}

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  completed: 'Complétée',
  cancelled: 'Annulée'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function ConsultationsPage() {
  const { toast } = useToast();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchConsultations = async () => {
    try {
      const data = await getConsultations();
      setConsultations(data as Consultation[]);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les consultations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.consultationType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || consultation.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateConsultation(id, { status: newStatus as Consultation['status'] });
      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus as Consultation['status'] } : c))
      );
      toast({ title: 'Succès', description: 'Statut mis à jour avec succès' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le statut', variant: 'destructive' });
    }
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
        <h1 className="text-3xl font-bold mb-2">Demandes de Consultation</h1>
        <p className="text-muted-foreground">Gérez les demandes de consultation</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une consultation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmées</SelectItem>
            <SelectItem value="completed">Complétées</SelectItem>
            <SelectItem value="cancelled">Annulées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredConsultations.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucune consultation trouvée</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredConsultations.map((consultation) => (
            <Card key={consultation.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">{consultation.name}</h3>
                    <Badge className={statusColors[consultation.status]}>
                      {statusLabels[consultation.status]}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline">{consultation.email}</Badge>
                    <Badge variant="outline">{consultation.phone}</Badge>
                  </div>
                  <p className="text-sm font-medium text-primary mb-2">{consultation.consultationType}</p>
                </div>
                <Select
                  value={consultation.status}
                  onValueChange={(value) => handleStatusChange(consultation.id!, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="completed">Complétée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Date préférée: {new Date(consultation.preferredDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Heure préférée: {consultation.preferredTime}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{consultation.description}</p>

              {consultation.createdAt && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Reçue le {new Date(consultation.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
