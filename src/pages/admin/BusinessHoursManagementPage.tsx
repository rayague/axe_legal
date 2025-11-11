import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Clock, Save, Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { getBusinessHours, updateBusinessHours, type BusinessHours } from "@/lib/firebaseApi";

export default function BusinessHoursManagementPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    weekdays: "08:00 - 18:00",
    saturday: "09:00 - 13:00",
    sunday: "Fermé",
  });

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

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Horaires Hebdomadaires
            </CardTitle>
            <CardDescription>
              Définissez les horaires d'ouverture pour les jours de la semaine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="weekdays">Lundi - Vendredi</Label>
              <Input
                id="weekdays"
                value={businessHours.weekdays}
                onChange={(e) =>
                  setBusinessHours({ ...businessHours, weekdays: e.target.value })
                }
                placeholder="Ex: 08:00 - 18:00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="saturday">Samedi</Label>
              <Input
                id="saturday"
                value={businessHours.saturday}
                onChange={(e) =>
                  setBusinessHours({ ...businessHours, saturday: e.target.value })
                }
                placeholder="Ex: 09:00 - 13:00 ou Fermé"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sunday">Dimanche</Label>
              <Input
                id="sunday"
                value={businessHours.sunday}
                onChange={(e) =>
                  setBusinessHours({ ...businessHours, sunday: e.target.value })
                }
                placeholder="Ex: Fermé"
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
              <div className="flex justify-between text-sm">
                <span className="font-medium">Lundi - Vendredi</span>
                <span className="text-muted-foreground">{businessHours.weekdays}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Samedi</span>
                <span className="text-muted-foreground">{businessHours.saturday}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Dimanche</span>
                <span className="text-muted-foreground">{businessHours.sunday}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-5 w-5" />
            {isSaving ? "Enregistrement..." : "Enregistrer les horaires"}
          </Button>
        </div>
      </div>
    </div>
  );
}
