import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  Award, 
  TrendingUp, 
  Users, 
  CheckCircle,
  ArrowRight,
  Quote,
  ThumbsUp,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import heroLegal from "@/assets/hero-legal.jpg";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getPublishedReviews, type Review } from "@/lib/firebaseApi";
import { useToast } from "@/hooks/use-toast";

const REVIEWS_PER_PAGE = 12;

export default function Testimonials() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await getPublishedReviews();
      setReviews(data);
      setTotalReviews(data.length);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: t("testimonials_section.toast_error_title", { defaultValue: "Erreur" }),
        description: t("testimonials_section.toast_error_desc", { defaultValue: "Impossible de charger les témoignages" }),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to reviews section
      document.getElementById('reviews-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <PageHero
          eyebrow={t("pages.testimonials.hero_eyebrow", { defaultValue: "Témoignages Clients" })}
          title={(
            <>
              {t("pages.testimonials.hero_title_prefix", { defaultValue: "La Confiance de Nos" })}{" "}
              <span className="text-yellow-400">{t("pages.testimonials.hero_title_highlight", { defaultValue: "Clients" })}</span>,<br />
            </>
          )}
          subtitle={t("pages.testimonials.hero_subtitle", { defaultValue: "Découvrez les témoignages authentiques de nos clients satisfaits. Leur réussite est notre fierté et témoigne de notre engagement envers l'excellence juridique." })}
          ctaText={t("pages.testimonials.hero_cta", { defaultValue: "Rejoignez-les" })}
          ctaLink="/contact"
          imageSrc={heroLegal}
          large
        />

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4" variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  {t("pages.testimonials.stats_badge", { defaultValue: "Notre Impact" })}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("pages.testimonials.stats_title_prefix", { defaultValue: "Des Chiffres qui" })}{" "}
                  <span className="text-primary">{t("pages.testimonials.stats_title_highlight", { defaultValue: "Parlent d'Eux-Mêmes" })}</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t("pages.testimonials.stats_subtitle", { defaultValue: "La satisfaction de nos clients se mesure aussi en chiffres" })}
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <Star className="h-7 w-7 text-primary fill-primary" />
                  </div>
                  <div className="text-4xl font-extrabold text-primary mb-2">
                    <AnimatedCounter value={4.9} decimals={1} suffix="/5" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{t("pages.testimonials.stats_avg_rating", { defaultValue: "Note Moyenne" })}</div>
                </Card>

                <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-4xl font-extrabold text-primary mb-2">
                    <AnimatedCounter value={150} suffix="+" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{t("pages.testimonials.stats_happy_clients", { defaultValue: "Clients Satisfaits" })}</div>
                </Card>

                <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <ThumbsUp className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-4xl font-extrabold text-primary mb-2">
                    <AnimatedCounter value={95} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{t("pages.testimonials.stats_recommendations", { defaultValue: "Recommandations" })}</div>
                </Card>

                <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-4xl font-extrabold text-primary mb-2">
                    <AnimatedCounter value={95} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{t("stats.success_rate", { defaultValue: "Taux de Réussite" })}</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Grid with Pagination */}
        <section id="reviews-grid" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">
                <Quote className="h-4 w-4 mr-2" />
                {t("pages.testimonials.all_reviews_badge", { defaultValue: "Tous les Avis" })}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("pages.testimonials.all_reviews_title", { defaultValue: "Ce que disent nos clients" })}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("pages.testimonials.all_reviews_subtitle", { defaultValue: "Découvrez les témoignages authentiques de nos clients satisfaits" })}
                {totalReviews > 0 && (
                  <span className="block mt-2 text-sm">
                    {t("pages.testimonials.showing", { defaultValue: "Affichage de" })} {startIndex + 1}-{Math.min(endIndex, totalReviews)} {t("pages.testimonials.of", { defaultValue: "sur" })} {totalReviews} {t("pages.testimonials.reviews", { defaultValue: "avis" })}
                  </span>
                )}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">{t("testimonials_section.loading", { defaultValue: "Chargement des témoignages..." })}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <Quote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("testimonials_section.empty", { defaultValue: "Aucun témoignage disponible pour le moment." })}</p>
              </div>
            ) : (
              <>
                {/* Reviews Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {currentReviews.map((item, index) => (
                    <Card
                      key={item.id}
                      className="p-6 hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 group bg-gradient-to-br from-background to-primary/5 hover:to-primary/10"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="space-y-4">
                        {/* Quote Icon */}
                        <div className="relative">
                          <Quote className="h-10 w-10 text-primary/20 absolute -top-2 -left-2" />
                          <div className="flex gap-1 relative z-10 pl-6">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                            ))}
                          </div>
                        </div>

                        {/* Content */}
                        <p className="text-muted-foreground leading-relaxed text-sm line-clamp-4">
                          "{item.comment}"
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-2 border-t border-primary/20">
                          <Avatar className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                            <AvatarImage src="" alt={item.name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-sm font-bold">
                              {getInitials(item.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                              {item.name}
                            </div>
                            <div className="text-xs text-muted-foreground">{t("testimonials_section.client", { defaultValue: "Client" })}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        {t("common.previous", { defaultValue: "Précédent" })}
                      </Button>

                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                          page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
                          ) : (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(page as number)}
                              className="min-w-[40px]"
                            >
                              {page}
                            </Button>
                          )
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        {t("common.next", { defaultValue: "Suivant" })}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {t("pages.testimonials.page", { defaultValue: "Page" })} {currentPage} {t("pages.testimonials.of", { defaultValue: "sur" })} {totalPages}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("pages.testimonials.trust_title_prefix", { defaultValue: "Pourquoi Nos Clients Nous Font" })}{" "}
                  <span className="text-primary">{t("pages.testimonials.trust_title_highlight", { defaultValue: "Confiance" })}</span>
                </h2>
                <p className="text-muted-foreground">
                  {t("pages.testimonials.trust_subtitle", { defaultValue: "Les raisons qui font de nous le partenaire juridique de choix" })}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{t("pages.testimonials.trust.items.0.title", { defaultValue: "Expertise Reconnue" })}</h3>
                      <p className="text-muted-foreground text-sm">
                        {t("pages.testimonials.trust.items.0.desc", { defaultValue: "Une équipe de juristes hautement qualifiés avec une expertise pointue dans chaque domaine du droit" })}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{t("pages.testimonials.trust.items.1.title", { defaultValue: "Approche Personnalisée" })}</h3>
                      <p className="text-muted-foreground text-sm">
                        {t("pages.testimonials.trust.items.1.desc", { defaultValue: "Chaque dossier est unique et mérite une attention particulière et des solutions sur mesure" })}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{t("pages.testimonials.trust.items.2.title", { defaultValue: "Transparence Totale" })}</h3>
                      <p className="text-muted-foreground text-sm">
                        {t("pages.testimonials.trust.items.2.desc", { defaultValue: "Communication claire, honoraires transparents et points réguliers sur l'avancement de votre dossier" })}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{t("pages.testimonials.trust.items.3.title", { defaultValue: "Résultats Concrets" })}</h3>
                      <p className="text-muted-foreground text-sm">
                        {t("pages.testimonials.trust.items.3.desc", { defaultValue: "Notre focus est mis sur l'atteinte de vos objectifs avec des stratégies éprouvées et efficaces" })}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 to-background">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Quote className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold">
                  {t("pages.testimonials.cta_title_prefix", { defaultValue: "Partagez Votre" })}{" "}
                  <span className="text-primary">{t("pages.testimonials.cta_title_highlight", { defaultValue: "Expérience" })}</span>
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t("pages.testimonials.cta_review_subtitle", { defaultValue: "Vous avez bénéficié de nos services ? Laissez un avis et aidez d'autres clients à nous découvrir." })}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="group" asChild>
                    <a href="/avis">
                      {t("pages.testimonials.leave_review", { defaultValue: "Laisser un Avis" })}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/contact">
                      {t("common.request_consultation", { defaultValue: "Demander une Consultation" })}
                    </a>
                  </Button>
                </div>

                <div className="pt-6 border-t border-primary/20 mt-8">
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{t("pages.testimonials.cta_pill_free", { defaultValue: "Consultation gratuite" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{t("pages.testimonials.cta_pill_no_commitment", { defaultValue: "Sans engagement" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{t("pages.testimonials.cta_pill_24h", { defaultValue: "Réponse sous 24h" })}</span>
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
