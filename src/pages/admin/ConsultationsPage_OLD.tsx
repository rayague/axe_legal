import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Mail, Phone, Trash2, RefreshCw, CheckCircle } from "lucide-react";

type ConsultationRequest = {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  service: string;
  datePreferee: string;
  heurePreferee: string;
  message: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

export default function ConsultationsPage() {
  const { token } = useAuth();
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, [token]);

  const fetchConsultations = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/consultations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.consultations) setConsultations(data.consultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: ConsultationRequest['status']) => {
    if (!token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/consultations/${id}/status`, {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      setConsultations(consultations.map(c => c.id === id ? { ...c, status } : c));
    } catch (error) {
      console.error('Error updating consultation status:', error);
    }
  };

  const deleteConsultation = async (id: number) => {
    if (!token || !confirm('Êtes-vous sûr de vouloir supprimer cette demande de consultation ?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/consultations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsultations(consultations.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting consultation:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };
  
  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Demandes de Consultation
              </CardTitle>
              <CardDescription>
                Demandes de rendez-vous reçues via le formulaire de consultation
              </CardDescription>
            </div>
            <Button
              onClick={fetchConsultations}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Chargement des consultations...</p>
          ) : consultations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucune demande de consultation pour le moment</p>
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <Card 
                  key={consultation.id} 
                  className={`border-2 ${consultation.status === 'pending' ? 'border-yellow-500/50 bg-yellow-50/30' : 'border-border'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg">{consultation.nom}</h3>
                          <Badge className={`text-xs ${statusColors[consultation.status]}`}>
                            {statusLabels[consultation.status]}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{consultation.service}</Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${consultation.email}`} className="hover:text-primary">
                              {consultation.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <a href={`tel:${consultation.telephone}`} className="hover:text-primary">
                              {consultation.telephone}
                            </a>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                            <span><strong>Date souhaitée:</strong> {new Date(consultation.datePreferee).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <Clock className="h-4 w-4 text-primary" />
                            <span><strong>Heure:</strong> {consultation.heurePreferee}</span>
                          </div>
                        </div>
                        
                        {consultation.message && (
                          <div className="pt-2 border-t">
                            <p className="text-sm font-semibold mb-1">Message:</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{consultation.message}</p>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          Demande reçue le {formatDate(consultation.date)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {consultation.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateStatus(consultation.id, 'confirmed')}
                              className="gap-2 bg-blue-600 hover:bg-blue-700"
                            >
                              Confirmer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(consultation.id, 'cancelled')}
                              className="gap-2"
                            >
                              Annuler
                            </Button>
                          </>
                        )}
                        {consultation.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateStatus(consultation.id, 'completed')}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Terminer
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteConsultation(consultation.id)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
