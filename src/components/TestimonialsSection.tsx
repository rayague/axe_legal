import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPublishedReviews, type Review } from "@/lib/firebaseApi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface TestimonialsSectionProps {
  limit?: number;
  showViewAllButton?: boolean;
}

export const TestimonialsSection = ({ limit, showViewAllButton = false }: TestimonialsSectionProps) => {
  const [testimonials, setTestimonials] = useState<Review[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await getPublishedReviews();
      setTotalCount(data.length);
      // Limiter si une limite est spécifiée
      setTestimonials(limit ? data.slice(0, limit) : data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: t("testimonials_section.toast_error_title", { defaultValue: "Erreur" }),
        description: t("testimonials_section.toast_error_desc", { defaultValue: "Impossible de charger les témoignages" }),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="py-20 bg-background" id="temoignages">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("testimonials_section.title_prefix", { defaultValue: "Témoignages" })}{" "}
            <span className="text-primary">{t("testimonials_section.title_highlight", { defaultValue: "Authentiques" })}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("testimonials_section.subtitle", { defaultValue: "Découvrez ce que nos clients disent de notre accompagnement juridique" })}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">{t("testimonials_section.loading", { defaultValue: "Chargement des témoignages..." })}</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <Quote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("testimonials_section.empty", { defaultValue: "Aucun témoignage disponible pour le moment." })}</p>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 lg:gap-8 ${limit ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {testimonials.map((item, index) => (
              <Card
                key={item.id}
                className="p-6 hover:shadow-2xl transition-all duration-500 animate-fade-in-up border-2 hover:border-primary/50 group bg-gradient-to-br from-background to-primary/5 hover:to-primary/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  {/* Quote Icon */}
                  <div className="relative">
                    <Quote className="h-12 w-12 text-primary/20 absolute -top-2 -left-2" />
                    <div className="flex gap-1 relative z-10 pl-8">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-accent text-accent"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground leading-relaxed text-base min-h-[100px]">
                    "{item.comment}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-2 border-t border-primary/20">
                    <Avatar className="h-14 w-14 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground ring-2 ring-primary/20">
                      <AvatarImage src="" alt={item.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                        {getInitials(item.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{t("testimonials_section.client", { defaultValue: "Client" })}</div>
                    </div>
                  </div>
                </div>
              </Card>
              ))}
            </div>
            
            {showViewAllButton && totalCount > (limit || 0) && (
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="group" asChild>
                  <Link to="/temoignages">
                    {t("testimonials_section.view_all", { defaultValue: "Voir tous les témoignages" })} ({totalCount})
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
