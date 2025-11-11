import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Briefcase, FileText, MessageSquare, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

type DashStats = { 
  users: number; 
  clients: number; 
  cases: number; 
  messages: number; 
  consultations: number 
};

type ContactMessage = {
  id: number;
  read: boolean;
};

type ConsultationRequest = {
  id: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

export default function DashboardHome() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [stats, setStats] = useState<DashStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        // Fetch stats
        const statsResponse = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsResponse.json();
        if (statsData.stats) setStats(statsData.stats);

        // Fetch messages
        const messagesResponse = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const messagesData = await messagesResponse.json();
        if (messagesData.messages) setMessages(messagesData.messages);

        // Fetch consultations
        const consultationsResponse = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/consultations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const consultationsData = await consultationsResponse.json();
        if (consultationsData.consultations) setConsultations(consultationsData.consultations);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const messagesUnread = messages.filter(m => !m.read).length;
  const consultationsPending = consultations.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Tableau de bord</h2>
        <p className="text-muted-foreground">Vue d'ensemble de votre cabinet juridique</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card 
          className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/admin/users")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "—" : stats?.users || 0}</div>
            <CardDescription className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500 text-xs">+12%</span>
              <span className="text-xs">ce mois</span>
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-purple-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/admin/clients")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Briefcase className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "—" : stats?.clients || 0}</div>
            <CardDescription className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500 text-xs">+8%</span>
              <span className="text-xs">ce mois</span>
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-orange-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/admin/cases")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dossiers</CardTitle>
            <FileText className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "—" : stats?.cases || 0}</div>
            <CardDescription className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500 text-xs">+23%</span>
              <span className="text-xs">ce mois</span>
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-green-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/admin/messages")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "—" : stats?.messages || 0}</div>
            <CardDescription className="flex items-center gap-1 mt-1">
              {messagesUnread > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {messagesUnread} nouveaux
                </Badge>
              )}
            </CardDescription>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-indigo-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/admin/consultations")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Calendar className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "—" : stats?.consultations || 0}</div>
            <CardDescription className="flex items-center gap-1 mt-1">
              {consultationsPending > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {consultationsPending} en attente
                </Badge>
              )}
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card 
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => navigate("/admin/messages")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Voir les Messages</h3>
                    <p className="text-sm text-muted-foreground">
                      {messagesUnread} non lu{messagesUnread > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => navigate("/admin/consultations")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Gérer Consultations</h3>
                    <p className="text-sm text-muted-foreground">
                      {consultationsPending} en attente
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => navigate("/admin/cases")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Gérer Dossiers</h3>
                    <p className="text-sm text-muted-foreground">
                      {stats?.cases || 0} dossier{(stats?.cases || 0) > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
