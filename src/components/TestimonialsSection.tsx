import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTestimonials } from "@/lib/firebaseApi";
import { pickLocalizedString, getCurrentLang } from "@/lib/i18nFields";
import { useTranslation } from "react-i18next";

interface Testimonial {
  id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const currentLang = getCurrentLang(i18n);

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await getTestimonials();
      setTestimonials(data as Testimonial[]);
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
                    "{pickLocalizedString(item.content, currentLang)}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-2 border-t border-primary/20">
                    <Avatar className="h-14 w-14 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground ring-2 ring-primary/20">
                      {item.image ? (
                        <AvatarImage src={item.image} alt={item.name} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                        {getInitials(item.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {pickLocalizedString(item.role, currentLang)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
