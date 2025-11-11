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
import { Calendar as CalendarIcon, Clock, Plus, Edit, Trash2, User, Mail, Phone, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Appointment = {
  id: number;
  title: string;
  client: string;
  email: string;
  phone: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
};

export default function CalendarPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    email: "",
    phone: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "consultation",
    status: "scheduled" as Appointment['status'],
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const fetchAppointments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.appointments) setAppointments(data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const url = editingAppointment
        ? `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/appointments/${editingAppointment.id}`
        : `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/appointments`;
      
      const method = editingAppointment ? 'PUT' : 'POST';

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
          title: editingAppointment ? "Rendez-vous modifié" : "Rendez-vous créé",
          description: "L'opération a été effectuée avec succès.",
        });
        fetchAppointments();
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

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      title: appointment.title,
      client: appointment.client,
      email: appointment.email,
      phone: appointment.phone,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès.",
      });
      fetchAppointments();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous.",
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (id: number, status: Appointment['status']) => {
    if (!token) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status } : apt));
      toast({
        title: "Statut mis à jour",
        description: "Le statut du rendez-vous a été modifié.",
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
      date: "",
      startTime: "",
      endTime: "",
      type: "consultation",
      status: "scheduled",
      notes: "",
    });
    setEditingAppointment(null);
  };

  const getWeekDates = () => {
    const week = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Lundi
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const filterAppointmentsByDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800 border-blue-300',
    confirmed: 'bg-green-100 text-green-800 border-green-300',
    completed: 'bg-gray-100 text-gray-800 border-gray-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusLabels = {
    scheduled: 'Planifié',
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };

  const typeColors = {
    consultation: 'bg-purple-100 text-purple-800',
    reunion: 'bg-indigo-100 text-indigo-800',
    audience: 'bg-orange-100 text-orange-800',
    autre: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-primary" />
            Gestion de l'Agenda
          </h2>
          <p className="text-muted-foreground mt-1">
            Gérez tous vos rendez-vous et horaires
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAppointments} variant="outline" size="sm">
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
                Nouveau Rendez-vous
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAppointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
                </DialogTitle>
                <DialogDescription>
                  Remplissez les informations du rendez-vous
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titre du rendez-vous *</Label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Consultation juridique"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="reunion">Réunion</SelectItem>
                        <SelectItem value="audience">Audience</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemple.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+229 XX XX XX XX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Heure de début *</Label>
                    <Input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Heure de fin *</Label>
                    <Input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Appointment['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Planifié</SelectItem>
                      <SelectItem value="confirmed">Confirmé</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notes additionnelles..."
                    rows={3}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingAppointment ? "Modifier" : "Créer"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmés</p>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Planifiés</p>
                <p className="text-2xl font-bold text-blue-600">
                  {appointments.filter(a => a.status === 'scheduled').length}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cette semaine</p>
                <p className="text-2xl font-bold">
                  {appointments.filter(a => {
                    const aptDate = new Date(a.date);
                    const weekDates = getWeekDates();
                    return weekDates.some(d => d.toDateString() === aptDate.toDateString());
                  }).length}
                </p>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vue Hebdomadaire</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold min-w-[200px] text-center">
                {getWeekDates()[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - {' '}
                {getWeekDates()[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Aujourd'hui
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {getWeekDates().map((date, index) => {
              const dayAppointments = filterAppointmentsByDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={`border rounded-lg p-3 min-h-[200px] ${
                    isToday ? 'bg-primary/5 border-primary' : 'bg-card'
                  }`}
                >
                  <div className="text-center mb-3">
                    <p className="text-xs text-muted-foreground">
                      {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? 'text-primary' : ''}`}>
                      {date.getDate()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className={`p-2 rounded text-xs cursor-pointer hover:shadow-md transition-shadow ${
                          statusColors[apt.status]
                        }`}
                        onClick={() => handleEdit(apt)}
                      >
                        <p className="font-semibold truncate">{formatTime(apt.startTime)}</p>
                        <p className="truncate">{apt.title}</p>
                        <p className="truncate text-xs opacity-75">{apt.client}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* List View */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Rendez-vous</CardTitle>
          <CardDescription>Tous les rendez-vous à venir</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Chargement...</p>
          ) : appointments.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Aucun rendez-vous</p>
          ) : (
            <div className="space-y-3">
              {appointments
                .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime())
                .map((apt) => (
                  <Card key={apt.id} className="border-l-4" style={{
                    borderLeftColor: apt.status === 'confirmed' ? '#10b981' : apt.status === 'scheduled' ? '#3b82f6' : '#6b7280'
                  }}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg">{apt.title}</h3>
                            <Badge className={statusColors[apt.status]}>
                              {statusLabels[apt.status]}
                            </Badge>
                            <Badge className={typeColors[apt.type as keyof typeof typeColors] || typeColors.autre}>
                              {apt.type.charAt(0).toUpperCase() + apt.type.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{apt.client}</span>
                            </div>
                            {apt.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <a href={`mailto:${apt.email}`} className="hover:text-primary">
                                  {apt.email}
                                </a>
                              </div>
                            )}
                            {apt.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <a href={`tel:${apt.phone}`} className="hover:text-primary">
                                  {apt.phone}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{new Date(apt.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(apt.startTime)} - {formatTime(apt.endTime)}</span>
                            </div>
                          </div>

                          {apt.notes && (
                            <div className="text-sm text-muted-foreground pt-2 border-t">
                              <strong>Notes:</strong> {apt.notes}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          {apt.status === 'scheduled' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateStatus(apt.id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Confirmer
                            </Button>
                          )}
                          {apt.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateStatus(apt.id, 'completed')}
                              className="bg-gray-600 hover:bg-gray-700"
                            >
                              Terminer
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(apt)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(apt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
