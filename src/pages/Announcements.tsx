import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getAnnouncements, type Announcement } from "@/lib/firebaseApi";
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
  Sparkles,
  ArrowRight,
  CheckCircle,
  Info,
  Zap,
  PartyPopper,
} from "lucide-react";
import heroLegal from "@/assets/hero-legal.jpg";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Gift,
  TrendingUp,
  Calendar,
  Megaphone,
  Star,
  Briefcase,
  AlertCircle,
  Tag,
  Info,
  Zap,
  PartyPopper,
};

const typeLabels: Record<string, string> = {
  promotion: "Promotion",
  event: "Événement",
  info: "Information",
  warning: "Avertissement",
  success: "Succès",
  urgent: "Urgent",
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'warning': return AlertCircle;
    case 'success': return CheckCircle;
    case 'urgent': return Zap;
    case 'event': return PartyPopper;
    case 'promotion': return Gift;
    default: return Info;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'warning': return 'from-yellow-500 to-orange-500';
    case 'success': return 'from-green-500 to-emerald-500';
    case 'urgent': return 'from-red-500 to-pink-500';
    case 'event': return 'from-purple-500 to-indigo-500';
    case 'promotion': return 'from-blue-500 to-cyan-500';
    default: return 'from-gray-500 to-slate-500';
  }
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");

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

  const filteredAnnouncements = selectedType === "all"
    ? announcements.filter(a => a.isActive !== false)
    : announcements.filter((a) => a.type === selectedType && a.isActive !== false);

  const featuredAnnouncements = announcements.filter((a) => a.priority === 'high' && a.isActive !== false);

  const isExpired = (endDate?: Date) => {
    return endDate ? new Date(endDate) < new Date() : false;
  };

  const daysRemaining = (endDate?: Date) => {
    if (!endDate) return 0;
    const days = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <PageHero
          eyebrow="Annonces & Opportunités"
          title={(
            <>
              Nos Dernières <span className="text-yellow-400">Opportunités</span>
            </>
          )}
          subtitle="Découvrez nos offres spéciales, promotions et opportunités exclusives. Ne manquez pas ces chances uniques de bénéficier de nos services juridiques à des conditions avantageuses !"
          ctaText="Voir les offres"
          ctaLink="#annonces"
          imageSrc={heroLegal}
          large
        />

        {/* Featured Announcements */}
        {featuredAnnouncements.length > 0 && (
          <section className="py-16 bg-gradient-to-b from-background to-primary/5" id="annonces">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Badge className="mb-4" variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  En Vedette
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  🌟 <span className="text-primary">Dernières Opportunités</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Nos meilleures offres du moment - Profitez-en avant qu'il ne soit trop tard !
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {featuredAnnouncements.map((announcement) => {
                  const Icon = getTypeIcon(announcement.type);
                  const expired = isExpired(announcement.endDate);
                  const remaining = daysRemaining(announcement.endDate);
                  const colorClass = getTypeColor(announcement.type);

                  return (
                    <Card
                      key={announcement.id}
                      className="group hover:shadow-2xl transition-all duration-300 border-2 border-primary/30 relative overflow-hidden"
                    >
                      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${colorClass}`} />
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-4 rounded-xl bg-gradient-to-br ${colorClass} text-white shadow-lg`}>
                            <Icon className="h-7 w-7" />
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            {typeLabels[announcement.type] || announcement.type}
                          </Badge>
                        </div>

                        {announcement.subtitle && (
                          <p className="text-sm text-primary font-semibold mb-2">{announcement.subtitle}</p>
                        )}

                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {announcement.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3 whitespace-pre-wrap">
                          {announcement.content}
                        </p>

                        {announcement.tags && announcement.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {announcement.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {announcement.endDate && (
                          <div className="flex items-center gap-2 text-sm mb-4 p-3 rounded-lg bg-muted">
                            <Clock className="h-4 w-4" />
                            {expired ? (
                              <span className="text-red-600 font-bold">Offre expirée</span>
                            ) : (
                              <span className="text-green-600 font-bold">
                                Plus que {remaining} jour{remaining > 1 ? "s" : ""} !
                              </span>
                            )}
                          </div>
                        )}

                        {announcement.link && (
                          <Button
                            asChild
                            className="w-full gap-2 group/btn"
                            variant={expired ? "outline" : "default"}
                            disabled={expired}
                          >
                            <a href={announcement.link} target="_blank" rel="noopener noreferrer">
                              {announcement.linkText || (expired ? "Offre terminée" : "En savoir plus")}
                              {!expired && <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />}
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Filter Tabs */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Toutes Nos <span className="text-primary">Annonces</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Filtrez par catégorie pour trouver ce qui vous intéresse
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              <Button
                size="lg"
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => setSelectedType("all")}
                className="gap-2"
              >
                Toutes les annonces
              </Button>
              <Button
                size="lg"
                variant={selectedType === "promotion" ? "default" : "outline"}
                onClick={() => setSelectedType("promotion")}
                className="gap-2"
              >
                <Gift className="h-4 w-4" />
                Promotions
              </Button>
              <Button
                size="lg"
                variant={selectedType === "event" ? "default" : "outline"}
                onClick={() => setSelectedType("event")}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Événements
              </Button>
              <Button
                size="lg"
                variant={selectedType === "info" ? "default" : "outline"}
                onClick={() => setSelectedType("info")}
                className="gap-2"
              >
                <Info className="h-4 w-4" />
                Informations
              </Button>
              <Button
                size="lg"
                variant={selectedType === "urgent" ? "default" : "outline"}
                onClick={() => setSelectedType("urgent")}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                Urgents
              </Button>
            </div>

            {/* All Announcements */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filteredAnnouncements.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <Megaphone className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Aucune annonce disponible</h3>
                  <p className="text-muted-foreground">
                    Revenez bientôt pour découvrir nos prochaines offres
                  </p>
                </div>
              ) : (
                filteredAnnouncements.map((announcement) => {
                  const Icon = getTypeIcon(announcement.type);
                  const expired = isExpired(announcement.endDate);
                  const remaining = daysRemaining(announcement.endDate);
                  const colorClass = getTypeColor(announcement.type);

                  return (
                    <Card
                      key={announcement.id}
                      className={`group hover:shadow-xl transition-all duration-300 border-2 ${
                        announcement.priority === 'high' ? "border-primary/30" : "border-border"
                      } ${expired ? "opacity-70" : ""}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClass} text-white`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline">
                              {typeLabels[announcement.type] || announcement.type}
                            </Badge>
                            {announcement.priority === 'high' && (
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            )}
                          </div>
                        </div>

                        {announcement.subtitle && (
                          <p className="text-sm text-primary font-semibold mb-2">{announcement.subtitle}</p>
                        )}

                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                          {announcement.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 whitespace-pre-wrap">
                          {announcement.content}
                        </p>

                        {announcement.tags && announcement.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {announcement.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {announcement.endDate && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 p-2 rounded bg-muted/50">
                            <Clock className="h-3 w-3" />
                            {expired ? (
                              <span className="text-red-600 font-semibold">Expiré</span>
                            ) : (
                              <span>
                                Valable jusqu'au {format(new Date(announcement.endDate), 'dd MMM yyyy', { locale: fr })}
                              </span>
                            )}
                          </div>
                        )}

                        {announcement.link && (
                          <Button
                            asChild
                            size="sm"
                            className="w-full gap-2"
                            variant={expired ? "outline" : "default"}
                            disabled={expired}
                          >
                            <a href={announcement.link} target="_blank" rel="noopener noreferrer">
                              {announcement.linkText || "En savoir plus"}
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center border-2 border-primary/20 shadow-2xl bg-gradient-to-br from-primary/5 to-background">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Gift className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ne Manquez Aucune <span className="text-primary">Opportunité</span>
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Contactez-nous dès maintenant pour bénéficier de nos offres exclusives et 
                  découvrir comment nous pouvons vous accompagner dans vos projets juridiques.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="group" asChild>
                    <Link to="/contact">
                      Nous Contacter
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/services">
                      Nos Services
                    </Link>
                  </Button>
                </div>

                <div className="pt-6 border-t border-primary/20 mt-8">
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Offres exclusives</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Tarifs préférentiels</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Réponse rapide</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
