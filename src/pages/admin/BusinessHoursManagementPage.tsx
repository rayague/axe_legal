import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Clock, Save, Calendar, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface BusinessHours {
  schedule: DaySchedule[];
  specialNote?: string;
  holidayNote?: string;
}

const DAYS = [
  { id: "monday", label: "Lundi" },
  { id: "tuesday", label: "Mardi" },
  { id: "wednesday", label: "Mercredi" },
  { id: "thursday", label: "Jeudi" },
  { id: "friday", label: "Vendredi" },
  { id: "saturday", label: "Samedi" },
  { id: "sunday", label: "Dimanche" },
];

export default function BusinessHoursManagementPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    schedule: DAYS.map(day => ({
      day: day.id,
      isOpen: day.id !== "sunday",
      openTime: "08:00",
      closeTime: "18:00",
    })),
    specialNote: "",
    holidayNote: "",
  });

  useEffect(() => {
    fetchBusinessHours();
  }, []);

  const fetchBusinessHours = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/business-hours", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBusinessHours(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des horaires:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:4000/api/admin/business-hours", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(businessHours),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Horaires d'ouverture mis à jour avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour les horaires",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateDaySchedule = (dayId: string, field: keyof DaySchedule, value: any) => {
    setBusinessHours(prev => ({
      ...prev,
      schedule: prev.schedule.map(day =>
        day.day === dayId ? { ...day, [field]: value } : day
      ),
    }));
  };

  const applyToWeekdays = () => {
    const monday = businessHours.schedule.find(d => d.day === "monday");
    if (!monday) return;

    setBusinessHours(prev => ({
      ...prev,
      schedule: prev.schedule.map(day => {
        if (["monday", "tuesday", "wednesday", "thursday", "friday"].includes(day.day)) {
          return {
            ...day,
            isOpen: monday.isOpen,
            openTime: monday.openTime,
            closeTime: monday.closeTime,
          };
        }
        return day;
      }),
    }));

    toast({
      title: "Appliqué",
      description: "Horaires du lundi appliqués à tous les jours de la semaine",
    });
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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Horaires d'Ouverture</h1>
        <p className="text-muted-foreground">
          Gérez les horaires d'ouverture du cabinet affichés sur le site
        </p>
      </div>

      {/* Schedule Cards */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Horaires Hebdomadaires
                </CardTitle>
                <CardDescription>
                  Définissez les horaires d'ouverture pour chaque jour de la semaine
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={applyToWeekdays}>
                Appliquer lundi à tous
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS.map((day) => {
              const schedule = businessHours.schedule.find(s => s.day === day.id);
              if (!schedule) return null;

              return (
                <div
                  key={day.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    schedule.isOpen ? "bg-background" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <Switch
                      checked={schedule.isOpen}
                      onCheckedChange={(checked) =>
                        updateDaySchedule(day.id, "isOpen", checked)
                      }
                    />
                    <Label className="font-semibold text-base cursor-pointer">
                      {day.label}
                    </Label>
                  </div>

                  {schedule.isOpen ? (
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground min-w-[60px]">
                          Ouverture
                        </Label>
                        <Input
                          type="time"
                          value={schedule.openTime}
                          onChange={(e) =>
                            updateDaySchedule(day.id, "openTime", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground min-w-[60px]">
                          Fermeture
                        </Label>
                        <Input
                          type="time"
                          value={schedule.closeTime}
                          onChange={(e) =>
                            updateDaySchedule(day.id, "closeTime", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 text-muted-foreground italic">
                      Fermé
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Special Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Notes Spéciales
            </CardTitle>
            <CardDescription>
              Informations complémentaires sur les horaires (fermetures exceptionnelles, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="specialNote">Note spéciale</Label>
              <Textarea
                id="specialNote"
                placeholder="Ex: Fermeture exceptionnelle le 25 décembre"
                value={businessHours.specialNote || ""}
                onChange={(e) =>
                  setBusinessHours(prev => ({ ...prev, specialNote: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="holidayNote">Jours fériés</Label>
              <Textarea
                id="holidayNote"
                placeholder="Ex: Fermé les jours fériés nationaux"
                value={businessHours.holidayNote || ""}
                onChange={(e) =>
                  setBusinessHours(prev => ({ ...prev, holidayNote: e.target.value }))
                }
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Aperçu
            </CardTitle>
            <CardDescription>
              Voici comment les horaires seront affichés sur le site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {businessHours.schedule.map((schedule) => {
                const dayLabel = DAYS.find(d => d.id === schedule.day)?.label;
                return (
                  <div key={schedule.day} className="flex justify-between text-sm">
                    <span className="font-medium">{dayLabel}</span>
                    {schedule.isOpen ? (
                      <span className="text-muted-foreground">
                        {schedule.openTime} - {schedule.closeTime}
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">Fermé</span>
                    )}
                  </div>
                );
              })}
              {businessHours.specialNote && (
                <div className="pt-3 mt-3 border-t text-sm text-amber-600 font-medium">
                  ⚠️ {businessHours.specialNote}
                </div>
              )}
              {businessHours.holidayNote && (
                <div className="text-sm text-muted-foreground italic">
                  📅 {businessHours.holidayNote}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-5 w-5" />
            {isSaving ? "Enregistrement..." : "Enregistrer les horaires"}
          </Button>
        </div>
      </div>
    </div>
  );
}
