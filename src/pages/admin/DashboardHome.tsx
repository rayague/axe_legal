import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Briefcase,
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  getServices, 
  getTeamMembers, 
  getTestimonials, 
  getMessages, 
  getConsultations 
} from '@/lib/firebaseApi';

export default function DashboardHome() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    services: 0,
    team: 0,
    testimonials: 0,
    messages: 0,
    consultations: 0,
    consultationsPending: 0
  });

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [services, team, testimonials, messages, consultations] = await Promise.all([
        getServices(),
        getTeamMembers(),
        getTestimonials(),
        getMessages(),
        getConsultations()
      ]);

      const consultationsPending = consultations.filter(
        (c: any) => c.status === 'pending'
      ).length;

      setStats({
        services: services.length,
        team: team.length,
        testimonials: testimonials.length,
        messages: messages.length,
        consultations: consultations.length,
        consultationsPending
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les statistiques',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Services',
      value: stats.services,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Membres équipe',
      value: stats.team,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Témoignages',
      value: stats.testimonials,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageSquare,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Consultations totales',
      value: stats.consultations,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Consultations en attente',
      value: stats.consultationsPending,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre cabinet</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Bienvenue sur le tableau de bord</h2>
          <p className="text-muted-foreground">
            Gérez votre cabinet juridique depuis cette interface. Utilisez le menu de navigation pour accéder aux différentes sections.
          </p>
        </Card>
      </div>
    </div>
  );
}
