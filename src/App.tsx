import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import RequireAdmin from "@/components/RequireAdmin";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Process from "./pages/Process";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Consultation from "./pages/Consultation";
import LegalTech from "./pages/LegalTech";
import NotFound from "./pages/NotFound";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import MessagesPage from "./pages/admin/MessagesPage";
import ConsultationsPage from "./pages/admin/ConsultationsPage";
import CalendarPage from "./pages/admin/CalendarPage";
import CasesPage from "./pages/admin/CasesPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import ServicesManagementPage from "./pages/admin/ServicesManagementPage";
import TeamManagementPage from "./pages/admin/TeamManagementPage";
import ProcessManagementPage from "./pages/admin/ProcessManagementPage";
import TestimonialsManagementPage from "./pages/admin/TestimonialsManagementPage";
import AnnouncementsManagementPage from "./pages/admin/AnnouncementsManagementPage";
import BusinessHoursManagementPage from "./pages/admin/BusinessHoursManagementPage";
import ProfilePage from "./pages/admin/ProfilePage";
import Announcements from "./pages/Announcements";
import PlaceholderPage from "./pages/admin/PlaceholderPage";
import SeedDataPage from "./pages/admin/SeedDataPage";
import TestFirestore from "./pages/admin/TestFirestore";
import SettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/equipe" element={<Team />} />
            <Route path="/processus" element={<Process />} />
            <Route path="/temoignages" element={<Testimonials />} />
            <Route path="/annonces" element={<Announcements />} />
            <Route path="/legaltech" element={<LegalTech />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Redirection de l'ancienne route vers la nouvelle */}
            <Route
              path="/admin/dashboard"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<DashboardHome />} />
            </Route>
            
            {/* Admin Routes avec Layout */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="cases" element={<CasesPage />} />
              <Route path="services" element={<ServicesManagementPage />} />
              <Route path="team" element={<TeamManagementPage />} />
              <Route path="process" element={<ProcessManagementPage />} />
              <Route path="testimonials" element={<TestimonialsManagementPage />} />
              <Route path="announcements" element={<AnnouncementsManagementPage />} />
              <Route path="business-hours" element={<BusinessHoursManagementPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="consultations" element={<ConsultationsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="seed-data" element={<SeedDataPage />} />
              <Route path="test-firestore" element={<TestFirestore />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
