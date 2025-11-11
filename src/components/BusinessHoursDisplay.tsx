import { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface BusinessHours {
  schedule: DaySchedule[];
  specialNote: string;
  holidayNote: string;
}

export function BusinessHoursDisplay() {
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/business-hours')
      .then(res => res.json())
      .then(data => {
        setBusinessHours(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching business hours:', error);
        setLoading(false);
      });
  }, []);

  const getCurrentDay = () => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[new Date().getDay()];
  };

  const isCurrentlyOpen = () => {
    if (!businessHours) return false;
    
    const currentDay = getCurrentDay();
    const todaySchedule = businessHours.schedule.find(s => s.day === currentDay);
    
    if (!todaySchedule || !todaySchedule.isOpen) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [openHour, openMin] = todaySchedule.openTime.split(':').map(Number);
    const [closeHour, closeMin] = todaySchedule.closeTime.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    return currentTime >= openMinutes && currentTime < closeMinutes;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horaires d'ouverture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  if (!businessHours) {
    return null;
  }

  const currentDay = getCurrentDay();
  const isOpen = isCurrentlyOpen();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Horaires d'ouverture
        </CardTitle>
        {isOpen !== null && (
          <div className="mt-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              isOpen 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-green-600' : 'bg-red-600'}`} />
              {isOpen ? 'Actuellement ouvert' : 'Actuellement fermé'}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {businessHours.schedule.map((schedule) => (
            <div 
              key={schedule.day} 
              className={`flex justify-between py-2 px-3 rounded-md transition-colors ${
                schedule.day === currentDay 
                  ? 'bg-primary/10 font-semibold' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <span className="text-sm">{schedule.day}</span>
              <span className="text-sm">
                {schedule.isOpen 
                  ? `${schedule.openTime} - ${schedule.closeTime}` 
                  : <span className="text-muted-foreground">Fermé</span>
                }
              </span>
            </div>
          ))}
        </div>

        {businessHours.specialNote && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {businessHours.specialNote}
            </AlertDescription>
          </Alert>
        )}

        {businessHours.holidayNote && (
          <p className="text-xs text-muted-foreground italic">
            {businessHours.holidayNote}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
