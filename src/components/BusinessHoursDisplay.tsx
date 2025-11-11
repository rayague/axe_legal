import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBusinessHours, type BusinessHours } from '@/lib/firebaseApi';

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

  if (!businessHours) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Horaires d'ouverture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between py-2 px-3 rounded-md">
            <span className="text-sm font-medium">Lundi - Vendredi</span>
            <span className="text-sm text-muted-foreground">{businessHours.weekdays}</span>
          </div>
          <div className="flex justify-between py-2 px-3 rounded-md">
            <span className="text-sm font-medium">Samedi</span>
            <span className="text-sm text-muted-foreground">{businessHours.saturday}</span>
          </div>
          <div className="flex justify-between py-2 px-3 rounded-md">
            <span className="text-sm font-medium">Dimanche</span>
            <span className="text-sm text-muted-foreground">{businessHours.sunday}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
