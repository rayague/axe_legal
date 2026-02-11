import { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getBusinessHours, type BusinessHours, type DaySchedule } from '@/lib/firebaseApi';
import { useTranslation } from 'react-i18next';

export function BusinessHoursDisplay() {
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

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
    if (!schedule.isOpen) return t('business_hours.closed', { defaultValue: 'Fermé' });
    
    let text = `${schedule.openTime} - ${schedule.closeTime}`;
    if (schedule.breakStart && schedule.breakEnd) {
      text += ` (${t('business_hours.break', { defaultValue: 'pause' })} ${schedule.breakStart} - ${schedule.breakEnd})`;
    }
    if (schedule.note) {
      text += ` • ${schedule.note}`;
    }
    return text;
  };

  const dayLabels: Record<keyof Omit<BusinessHours, 'holidays' | 'exceptionalClosure' | 'timezone' | 'lastUpdated'>, string> = {
    monday: t('business_hours.days.monday', { defaultValue: 'Lundi' }),
    tuesday: t('business_hours.days.tuesday', { defaultValue: 'Mardi' }),
    wednesday: t('business_hours.days.wednesday', { defaultValue: 'Mercredi' }),
    thursday: t('business_hours.days.thursday', { defaultValue: 'Jeudi' }),
    friday: t('business_hours.days.friday', { defaultValue: 'Vendredi' }),
    saturday: t('business_hours.days.saturday', { defaultValue: 'Samedi' }),
    sunday: t('business_hours.days.sunday', { defaultValue: 'Dimanche' }),
  };

  if (loading || !businessHours) {
    return null;
  }

  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const today = new Date().toLocaleDateString(locale);
  const isExceptionalClosure = businessHours.exceptionalClosure?.some(
    closure => new Date(closure.date).toLocaleDateString(locale) === today
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('business_hours.title', { defaultValue: "Horaires d'ouverture" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isExceptionalClosure && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('business_hours.exceptional_closure', { defaultValue: "Fermé exceptionnellement aujourd'hui :" })}{" "}
              {businessHours.exceptionalClosure?.find(c => new Date(c.date).toLocaleDateString(locale) === today)?.reason}
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
            <p className="text-xs font-medium mb-2">{t('business_hours.holidays_label', { defaultValue: 'Jours fériés (fermé) :' })}</p>
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
