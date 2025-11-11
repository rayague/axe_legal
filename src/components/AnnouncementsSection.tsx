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

interface Announcement {
  id: string;
  title: string;
  description: string;
  content: string;
  type: "promotion" | "opportunity" | "event" | "news";
  icon: string;
  color: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  link?: string;
  imageUrl?: string;
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
      const response = await fetch("http://localhost:4000/api/announcements/featured");
      if (response.ok) {
        const data = await response.json();
        // Limiter à 3 annonces vedettes
        setAnnouncements(data.slice(0, 3));
      }
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
          title="🎯 Dernières Opportunités"
          subtitle="Découvrez nos offres spéciales, promotions et opportunités exclusives"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {announcements.map((announcement) => {
            const Icon = iconMap[announcement.icon] || Megaphone;
            const remaining = daysRemaining(announcement.endDate);

            return (
              <Card
                key={announcement.id}
                className="group hover:shadow-xl transition-all duration-300 border-2 border-primary/20 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${announcement.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${announcement.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                      {typeLabels[announcement.type]}
                    </Badge>
                  </div>

                  {announcement.imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {announcement.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {announcement.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-semibold">
                      {remaining} jour{remaining > 1 ? "s" : ""} restant{remaining > 1 ? "s" : ""}
                    </span>
                  </div>

                  {announcement.link && (
                    <Button
                      asChild
                      className="w-full gap-2"
                      size="sm"
                    >
                      <a href={announcement.link} target="_blank" rel="noopener noreferrer">
                        En savoir plus
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="gap-2 shadow-lg">
            <Link to="/annonces">
              Voir toutes les opportunités
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
