import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Clock, Save, Calendar, Plus, X, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getBusinessHours, updateBusinessHours, type BusinessHours, type DaySchedule } from "@/lib/firebaseApi";

export default function BusinessHoursManagementPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
    saturday: { isOpen: true, openTime: '09:00', closeTime: '13:00' },
    sunday: { isOpen: false },
    holidays: [],
    exceptionalClosure: [],
    timezone: 'Europe/Paris',
  });
  const [newHoliday, setNewHoliday] = useState('');
  const [newClosureDate, setNewClosureDate] = useState('');
  const [newClosureReason, setNewClosureReason] = useState('');

  useEffect(() => {
    fetchBusinessHours();
  }, []);

  const fetchBusinessHours = async () => {
    try {
      const data = await getBusinessHours();
      setBusinessHours(data);
    } catch (error) {
      console.error("Erreur lors du chargement des horaires:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les horaires",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBusinessHours(businessHours);
      toast({
        title: "Succès",
        description: "Horaires d'ouverture mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les horaires",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateDaySchedule = (day: keyof BusinessHours, field: keyof DaySchedule, value: any) => {
    setBusinessHours({
      ...businessHours,
      [day]: {
        ...(businessHours[day] as DaySchedule),
        [field]: value,
      },
    });
  };

  const addHoliday = () => {
    if (newHoliday.trim()) {
      setBusinessHours({
        ...businessHours,
        holidays: [...(businessHours.holidays || []), newHoliday.trim()],
      });
      setNewHoliday('');
    }
  };

  const removeHoliday = (holiday: string) => {
    setBusinessHours({
      ...businessHours,
      holidays: businessHours.holidays?.filter(h => h !== holiday),
    });
  };

  const addExceptionalClosure = () => {
    if (newClosureDate && newClosureReason.trim()) {
      setBusinessHours({
        ...businessHours,
        exceptionalClosure: [
          ...(businessHours.exceptionalClosure || []),
          { date: newClosureDate, reason: newClosureReason.trim() },
        ],
      });
      setNewClosureDate('');
      setNewClosureReason('');
    }
  };

  const removeExceptionalClosure = (index: number) => {
    setBusinessHours({
      ...businessHours,
      exceptionalClosure: businessHours.exceptionalClosure?.filter((_, i) => i !== index),
    });
  };

  const renderDaySchedule = (day: keyof BusinessHours, label: string) => {
    const schedule = businessHours[day] as DaySchedule;
    if (!schedule) return null;

    return (
      <Card key={day}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{label}</CardTitle>
            <Switch
              checked={schedule.isOpen}
              onCheckedChange={(checked) => updateDaySchedule(day, 'isOpen', checked)}
            />
          </div>
        </CardHeader>
        {schedule.isOpen && (
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor={`${day}-open`}>Ouverture</Label>
                <Input
                  id={`${day}-open`}
                  type="time"
                  value={schedule.openTime || ''}
                  onChange={(e) => updateDaySchedule(day, 'openTime', e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`${day}-close`}>Fermeture</Label>
                <Input
                  id={`${day}-close`}
                  type="time"
                  value={schedule.closeTime || ''}
                  onChange={(e) => updateDaySchedule(day, 'closeTime', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor={`${day}-break-start`}>Pause début (optionnel)</Label>
                <Input
                  id={`${day}-break-start`}
                  type="time"
                  value={schedule.breakStart || ''}
                  onChange={(e) => updateDaySchedule(day, 'breakStart', e.target.value)}
                  placeholder="12:00"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`${day}-break-end`}>Pause fin (optionnel)</Label>
                <Input
                  id={`${day}-break-end`}
                  type="time"
                  value={schedule.breakEnd || ''}
                  onChange={(e) => updateDaySchedule(day, 'breakEnd', e.target.value)}
                  placeholder="14:00"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor={`${day}-note`}>Note (optionnel)</Label>
              <Input
                id={`${day}-note`}
                value={schedule.note || ''}
                onChange={(e) => updateDaySchedule(day, 'note', e.target.value)}
                placeholder="Ex: Sur rendez-vous uniquement"
              />
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des horaires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Horaires d'Ouverture</h1>
          <p className="text-muted-foreground">
            Gérez les horaires d'ouverture du cabinet affichés sur le site
          </p>
        </div>
        <Button size="lg" onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-5 w-5" />
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Horaires hebdomadaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Horaires Hebdomadaires
            </CardTitle>
            <CardDescription>
              Configurez les horaires d'ouverture pour chaque jour de la semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {renderDaySchedule('monday', 'Lundi')}
              {renderDaySchedule('tuesday', 'Mardi')}
              {renderDaySchedule('wednesday', 'Mercredi')}
              {renderDaySchedule('thursday', 'Jeudi')}
              {renderDaySchedule('friday', 'Vendredi')}
              {renderDaySchedule('saturday', 'Samedi')}
              {renderDaySchedule('sunday', 'Dimanche')}
            </div>
          </CardContent>
        </Card>

        {/* Jours fériés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Jours Fériés
            </CardTitle>
            <CardDescription>
              Ajoutez les jours fériés où le cabinet est fermé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newHoliday}
                onChange={(e) => setNewHoliday(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHoliday()}
                placeholder="Ex: 1er Mai - Fête du Travail"
              />
              <Button onClick={addHoliday} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {businessHours.holidays?.map((holiday, index) => (
                <Badge key={index} variant="secondary" className="gap-1 px-3 py-1">
                  {holiday}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeHoliday(holiday)} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fermetures exceptionnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Fermetures Exceptionnelles
            </CardTitle>
            <CardDescription>
              Planifiez les fermetures exceptionnelles (congés, formations, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
              <Input
                type="date"
                value={newClosureDate}
                onChange={(e) => setNewClosureDate(e.target.value)}
                placeholder="Date"
              />
              <Input
                value={newClosureReason}
                onChange={(e) => setNewClosureReason(e.target.value)}
                placeholder="Raison de la fermeture"
              />
              <Button onClick={addExceptionalClosure} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {businessHours.exceptionalClosure?.map((closure, index) => (
                <Alert key={index}>
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{new Date(closure.date).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</span>
                      <span className="mx-2">-</span>
                      <span>{closure.reason}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeExceptionalClosure(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Aperçu */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Aperçu Public
            </CardTitle>
            <CardDescription>
              Voici comment les horaires seront affichés sur le site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
                  const schedule = businessHours[day] as DaySchedule;
                  const dayLabels = {
                    monday: 'Lundi',
                    tuesday: 'Mardi',
                    wednesday: 'Mercredi',
                    thursday: 'Jeudi',
                    friday: 'Vendredi',
                    saturday: 'Samedi',
                    sunday: 'Dimanche',
                  };
                  
                  return (
                    <div key={day} className="flex justify-between text-sm py-1 border-b">
                      <span className="font-medium">{dayLabels[day]}</span>
                      <span className="text-muted-foreground">
                        {schedule.isOpen
                          ? `${schedule.openTime} - ${schedule.closeTime}${
                              schedule.breakStart ? ` (pause ${schedule.breakStart} - ${schedule.breakEnd})` : ''
                            }${schedule.note ? ` • ${schedule.note}` : ''}`
                          : 'Fermé'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
