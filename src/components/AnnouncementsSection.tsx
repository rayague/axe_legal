import { useState, useEffect } from "react";
import { SectionHeader } from "./SectionHeader";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Gift,
  TrendingUp,
  Calendar,
  Megaphone,
  Star,
  Briefcase,
  AlertCircle,
  Tag,
  ExternalLink,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAnnouncements } from "@/lib/firebaseApi";

interface Announcement {
  id?: string;
  title: string;
  content: string;
  type: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Gift,
  TrendingUp,
  Calendar,
  Megaphone,
  Star,
  Briefcase,
  AlertCircle,
  Tag,
};

const typeLabels: Record<string, string> = {
  promotion: "Promotion",
  opportunity: "Opportunité",
  event: "Événement",
  news: "Actualité",
};

export const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data as Announcement[]);
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const daysRemaining = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (isLoading || announcements.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="🎯 Dernières Annonces"
          subtitle="Découvrez nos dernières actualités et annonces"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {announcements.map((announcement) => {
            return (
              <Card
                key={announcement.id}
                className="group hover:shadow-xl transition-all duration-300 border-2 border-primary/20 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white">
                      <Megaphone className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                      {typeLabels[announcement.type] || announcement.type}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {announcement.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {announcement.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="gap-2 shadow-lg">
            <Link to="/contact">
              Nous contacter
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
