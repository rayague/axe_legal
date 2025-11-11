import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { 
  Home,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Scale,
  GitBranch,
  Star,
  Megaphone,
  Clock,
  UserCircle
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Tableau de bord", path: "/admin" },
    { id: "profile", icon: UserCircle, label: "Profil", path: "/admin/profile" },
    { id: "cases", icon: FileText, label: "Dossiers", path: "/admin/cases" },
    { id: "services", icon: Scale, label: "Services", path: "/admin/services" },
    { id: "team", icon: Users, label: "Équipe", path: "/admin/team" },
    { id: "process", icon: GitBranch, label: "Processus", path: "/admin/process" },
    { id: "testimonials", icon: Star, label: "Témoignages", path: "/admin/testimonials" },
    { id: "announcements", icon: Megaphone, label: "Annonces", path: "/admin/announcements" },
    { id: "business-hours", icon: Clock, label: "Horaires", path: "/admin/business-hours" },
    { id: "messages", icon: MessageSquare, label: "Messages", path: "/admin/messages" },
    { id: "consultations", icon: Calendar, label: "Consultations", path: "/admin/consultations" },
    { id: "calendar", icon: Calendar, label: "Agenda", path: "/admin/calendar" },
    { id: "notifications", icon: Bell, label: "Notifications", path: "/admin/notifications" },
    { id: "settings", icon: Settings, label: "Paramètres", path: "/admin/settings" },
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
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/10 ${
                    isActive ? "bg-white/20 font-semibold" : "text-white/80"
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
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
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
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
}
