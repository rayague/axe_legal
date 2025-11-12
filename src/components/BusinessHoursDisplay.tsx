import { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getBusinessHours, type BusinessHours, type DaySchedule } from '@/lib/firebaseApi';

export function BusinessHoursDisplay() {
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBusinessHours()
      .then(data => {
        setBusinessHours(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching business hours:', error);
        setLoading(false);
      });
  }, []);

  const formatSchedule = (schedule: DaySchedule) => {
    if (!schedule.isOpen) return 'Fermé';
    
    let text = `${schedule.openTime} - ${schedule.closeTime}`;
    if (schedule.breakStart && schedule.breakEnd) {
      text += ` (pause ${schedule.breakStart} - ${schedule.breakEnd})`;
    }
    if (schedule.note) {
      text += ` • ${schedule.note}`;
    }
    return text;
  };

  const dayLabels: Record<keyof Omit<BusinessHours, 'holidays' | 'exceptionalClosure' | 'timezone' | 'lastUpdated'>, string> = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
  };

  if (loading || !businessHours) {
    return null;
  }

  const today = new Date().toLocaleDateString('fr-FR');
  const isExceptionalClosure = businessHours.exceptionalClosure?.some(
    closure => new Date(closure.date).toLocaleDateString('fr-FR') === today
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Horaires d'ouverture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isExceptionalClosure && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Fermé exceptionnellement aujourd'hui : {businessHours.exceptionalClosure?.find(c => new Date(c.date).toLocaleDateString('fr-FR') === today)?.reason}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          {(Object.keys(dayLabels) as Array<keyof typeof dayLabels>).map((day) => {
            const schedule = businessHours[day] as DaySchedule;
            return (
              <div key={day} className="flex justify-between py-2 px-3 rounded-md hover:bg-accent">
                <span className="text-sm font-medium">{dayLabels[day]}</span>
                <span className={`text-sm ${schedule.isOpen ? 'text-muted-foreground' : 'text-destructive'}`}>
                  {formatSchedule(schedule)}
                </span>
              </div>
            );
          })}
        </div>

        {businessHours.holidays && businessHours.holidays.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-xs font-medium mb-2">Jours fériés (fermé) :</p>
            <div className="flex flex-wrap gap-1">
              {businessHours.holidays.slice(0, 3).map((holiday, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {holiday}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
