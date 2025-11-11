import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Users, 
  Briefcase, 
  FileText, 
  LogOut, 
  Home,
  MessageSquare,
  Settings,
  Bell,
  Calendar,
  TrendingUp,
  Menu,
  X,
  Shield,
  Scale,
  Mail,
  Phone,
  Trash2,
  Eye,
  RefreshCw,
  CheckCircle,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

type DashStats = { users: number; clients: number; cases: number; messages: number; consultations: number };
type ContactMessage = {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
  date: string;
  read: boolean;
};

type ConsultationRequest = {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  service: string;
  datePreferee: string;
  heurePreferee: string;
  message: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState<DashStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [consultationsLoading, setConsultationsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (token) {
      // Fetch dashboard stats
      fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          console.log('Dashboard stats:', data);
          if (data.stats) setStats(data.stats);
        })
        .catch((error) => {
          console.error('Error fetching dashboard stats:', error);
        })
        .finally(() => setLoading(false));

      // Fetch contact messages
      fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          console.log('Messages data:', data);
          if (data.messages) setMessages(data.messages);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
        })
        .finally(() => setMessagesLoading(false));

      // Fetch consultations
      fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/consultations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          console.log('Consultations data:', data);
          if (data.consultations) setConsultations(data.consultations);
        })
        .catch((error) => {
          console.error('Error fetching consultations:', error);
        })
        .finally(() => setConsultationsLoading(false));
    }
  }, [token]);

  const markAsRead = async (id: number) => {
    if (!token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/messages/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.map(msg => msg.id === id ? { ...msg, read: true } : msg));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!token || !confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter(msg => msg.id !== id));
      if (stats) {
        setStats({ ...stats, messages: stats.messages - 1 });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const refreshMessages = async () => {
    if (!token) return;
    setMessagesLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('Messages refreshed:', data);
      if (data.messages) setMessages(data.messages);
      
      // Refresh stats too
      const statsResponse = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsResponse.json();
      if (statsData.stats) setStats(statsData.stats);
    } catch (error) {
      console.error('Error refreshing messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const updateConsultationStatus = async (id: number, status: ConsultationRequest['status']) => {
    if (!token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/consultations/${id}/status`, {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      setConsultations(consultations.map(c => c.id === id ? { ...c, status } : c));
    } catch (error) {
      console.error('Error updating consultation status:', error);
    }
  };

  const deleteConsultation = async (id: number) => {
    if (!token || !confirm('Êtes-vous sûr de vouloir supprimer cette demande de consultation ?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/consultations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsultations(consultations.filter(c => c.id !== id));
      if (stats) {
        setStats({ ...stats, consultations: stats.consultations - 1 });
      }
    } catch (error) {
      console.error('Error deleting consultation:', error);
    }
  };

  const refreshConsultations = async () => {
    if (!token) return;
    setConsultationsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/consultations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('Consultations refreshed:', data);
      if (data.consultations) setConsultations(data.consultations);
      
      // Refresh stats too
      const statsResponse = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsResponse.json();
      if (statsData.stats) setStats(statsData.stats);
    } catch (error) {
      console.error('Error refreshing consultations:', error);
    } finally {
      setConsultationsLoading(false);
    }
  };

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Tableau de bord" },
    { id: "users", icon: Users, label: "Utilisateurs" },
    { id: "clients", icon: Briefcase, label: "Clients" },
    { id: "cases", icon: FileText, label: "Dossiers" },
    { id: "messages", icon: MessageSquare, label: "Messages" },
    { id: "consultations", icon: Calendar, label: "Consultations" },
    { id: "calendar", icon: Calendar, label: "Agenda" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "settings", icon: Settings, label: "Paramètres" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-primary text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h2 className="font-bold text-lg">Axe Legal</h2>
                  <p className="text-xs text-white/70">Administration</p>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/10 ${
                  activeTab === item.id ? "bg-white/20 font-semibold" : "text-white/80"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className={`flex items-center gap-3 ${sidebarOpen ? "" : "justify-center"}`}>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user?.name || "Admin"}</p>
                  <p className="text-xs text-white/70 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className={`w-full mt-3 text-white hover:bg-white/10 ${sidebarOpen ? "" : "px-2"}`}
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && <span className="ml-2">Déconnexion</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="bg-white border-b shadow-sm sticky top-0 z-40">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold">Tableau de bord</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Vue d'ensemble de votre cabinet
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/" className="gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Retour au site</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Stats Cards - Always visible */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
            <Card 
              className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("users")}
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
              onClick={() => setActiveTab("clients")}
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
              onClick={() => setActiveTab("cases")}
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
              onClick={() => setActiveTab("messages")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? "—" : stats?.messages || 0}</div>
                <CardDescription className="flex items-center gap-1 mt-1">
                  {messages.filter(m => !m.read).length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {messages.filter(m => !m.read).length} nouveaux
                    </Badge>
                  )}
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="border-l-4 border-l-indigo-500 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("consultations")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                <Calendar className="h-5 w-5 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? "—" : stats?.consultations || 0}</div>
                <CardDescription className="flex items-center gap-1 mt-1">
                  {consultations.filter(c => c.status === 'pending').length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {consultations.filter(c => c.status === 'pending').length} en attente
                    </Badge>
                  )}
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Tab Content */}
          {activeTab === "dashboard" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    Bienvenue sur le panneau administrateur
                  </CardTitle>
                  <CardDescription>Gérez les données du cabinet Axe Legal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Ce tableau de bord vous permet de gérer l'ensemble des activités du cabinet.
                    Vous avez accès aux statistiques en temps réel et aux outils de gestion.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="gap-2" onClick={() => setActiveTab("clients")}>
                      <Users className="h-4 w-4" />
                      Gérer les clients
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => setActiveTab("cases")}>
                      <FileText className="h-4 w-4" />
                      Voir les dossiers
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Activités récentes
                  </CardTitle>
                  <CardDescription>Dernières actions sur le système</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nouveau client ajouté</p>
                        <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Dossier mis à jour</p>
                        <p className="text-xs text-muted-foreground">Il y a 5 heures</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nouveau message reçu</p>
                        <p className="text-xs text-muted-foreground">Hier</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Messages de Contact
                    </CardTitle>
                    <CardDescription>
                      Messages reçus via le formulaire de contact du site web
                    </CardDescription>
                  </div>
                  <Button
                    onClick={refreshMessages}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={messagesLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${messagesLoading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
              {messagesLoading ? (
                <p className="text-muted-foreground text-center py-8">Chargement des messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucun message pour le moment</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <Card 
                      key={msg.id} 
                      className={`border-2 ${!msg.read ? 'border-primary/50 bg-primary/5' : 'border-border'}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-lg">{msg.nom}</h3>
                              {!msg.read && (
                                <Badge variant="default" className="text-xs">Nouveau</Badge>
                              )}
                              {msg.sujet && (
                                <Badge variant="outline" className="text-xs">{msg.sujet}</Badge>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <a href={`mailto:${msg.email}`} className="hover:text-primary">
                                  {msg.email}
                                </a>
                              </div>
                              {msg.telephone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <a href={`tel:${msg.telephone}`} className="hover:text-primary">
                                    {msg.telephone}
                                  </a>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(msg.date)}</span>
                              </div>
                            </div>
                            
                            <div className="pt-2 border-t">
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {!msg.read && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsRead(msg.id)}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                Marquer lu
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteMessage(msg.id)}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
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
          )}

          {/* Consultations Tab */}
          {activeTab === "consultations" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Demandes de Consultation
                    </CardTitle>
                    <CardDescription>
                      Demandes de rendez-vous reçues via le formulaire de consultation
                    </CardDescription>
                  </div>
                  <Button
                    onClick={refreshConsultations}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={consultationsLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${consultationsLoading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
              {consultationsLoading ? (
                <p className="text-muted-foreground text-center py-8">Chargement des consultations...</p>
              ) : consultations.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucune demande de consultation pour le moment</p>
              ) : (
                <div className="space-y-4">
                  {consultations.map((consultation) => {
                    const statusColors = {
                      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
                      completed: 'bg-green-100 text-green-800 border-green-300',
                      cancelled: 'bg-red-100 text-red-800 border-red-300',
                    };
                    
                    const statusLabels = {
                      pending: 'En attente',
                      confirmed: 'Confirmé',
                      completed: 'Terminé',
                      cancelled: 'Annulé',
                    };

                    return (
                      <Card 
                        key={consultation.id} 
                        className={`border-2 ${consultation.status === 'pending' ? 'border-yellow-500/50 bg-yellow-50/30' : 'border-border'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-lg">{consultation.nom}</h3>
                                <Badge className={`text-xs ${statusColors[consultation.status]}`}>
                                  {statusLabels[consultation.status]}
                                </Badge>
                                <Badge variant="outline" className="text-xs">{consultation.service}</Badge>
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <a href={`mailto:${consultation.email}`} className="hover:text-primary">
                                    {consultation.email}
                                  </a>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <a href={`tel:${consultation.telephone}`} className="hover:text-primary">
                                    {consultation.telephone}
                                  </a>
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <span><strong>Date souhaitée:</strong> {new Date(consultation.datePreferee).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span><strong>Heure:</strong> {consultation.heurePreferee}</span>
                                </div>
                              </div>
                              
                              {consultation.message && (
                                <div className="pt-2 border-t">
                                  <p className="text-sm font-semibold mb-1">Message:</p>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{consultation.message}</p>
                                </div>
                              )}

                              <div className="text-xs text-muted-foreground pt-2 border-t">
                                Demande reçue le {formatDate(consultation.date)}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              {consultation.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => updateConsultationStatus(consultation.id, 'confirmed')}
                                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                                  >
                                    Confirmer
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateConsultationStatus(consultation.id, 'cancelled')}
                                    className="gap-2"
                                  >
                                    Annuler
                                  </Button>
                                </>
                              )}
                              {consultation.status === 'confirmed' && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => updateConsultationStatus(consultation.id, 'completed')}
                                  className="gap-2 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Terminer
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteConsultation(consultation.id)}
                                className="gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          )}

          {/* Other Tabs - Coming soon */}
          {(activeTab === "users" || activeTab === "clients" || activeTab === "cases" || 
            activeTab === "calendar" || activeTab === "notifications" || activeTab === "settings") && (
            <Card>
              <CardHeader>
                <CardTitle>Section en développement</CardTitle>
                <CardDescription>Cette fonctionnalité sera bientôt disponible</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  La section "{menuItems.find(m => m.id === activeTab)?.label}" est en cours de développement.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
