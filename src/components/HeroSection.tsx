import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Phone, ArrowRight, Building2, Award, ShieldCheck, Lightbulb, Globe2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import TypedText from "@/components/TypedText";
import Carousel from "@/components/Carousel";
import heroImage from "@/assets/hero-legal.jpg";
import businessLaw from "@/assets/business-law.jpg";
import taxLaw from "@/assets/tax-law.jpg";
import realEstateLaw from "@/assets/real-estate-law.jpg";
import laborLaw from "@/assets/labor-law.jpg";
import AnimatedCounter from "@/components/AnimatedCounter";
import SimpleCarousel from "@/components/SimpleCarousel";

export const HeroSection = () => {
  const { t } = useTranslation();

  // parallax for blobs
  const blob1Ref = useRef<HTMLDivElement | null>(null);
  const blob2Ref = useRef<HTMLDivElement | null>(null);
  const blob3Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const handleMove = (e: PointerEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 .. 1
      const dy = (e.clientY - cy) / cy;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (blob1Ref.current) blob1Ref.current.style.transform = `translate(${dx * 12}px, ${dy * 10}px)`;
        if (blob2Ref.current) blob2Ref.current.style.transform = `translate(${dx * -10}px, ${dy * -8}px)`;
        if (blob3Ref.current) blob3Ref.current.style.transform = `translate(${dx * 8}px, ${dy * -6}px)`;
      });
    };

    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section style={{ paddingTop: 'var(--site-header-height, 56px)' }} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50">

      {/* Animated background blobs */}
      <div className="hero-bg" aria-hidden>
        <div className="hero-gradient" />
        <div ref={blob1Ref} className="blob blob-1" />
        <div ref={blob2Ref} className="blob blob-2" />
        <div ref={blob3Ref} className="blob blob-3" />
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 gap-2 px-4 py-2">
              <Building2 className="h-4 w-4" />
              <span>{t("hero.badge", { defaultValue: "Cabinet d'Excellence Juridique" })}</span>
            </Badge>

            <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  {t("hero.title_prefix", { defaultValue: "Votre Partenaire" })}{" "}
                  <span className="text-primary inline-block whitespace-nowrap min-w-[9ch]">
                    <TypedText text={t("hero.title_typed", { defaultValue: "Juridique" })} />
                  </span>{' '}
                  <span className="block lg:inline">{t("hero.title_suffix", { defaultValue: "de Confiance au Bénin" })}</span>
                </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t("hero.subtitle", { defaultValue: "Nous accompagnons entreprises et particuliers avec des solutions juridiques efficaces, une expertise solide et un service hautement professionnel depuis 2020." })}
              </p>

              <div className="w-full max-w-2xl mx-auto rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
                  <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                    <Globe2 className="h-5 w-5" />
                    <span>{t("banners.english_available_title", { defaultValue: "Service disponible en anglais" })}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("banners.english_available_subtitle", { defaultValue: "English available for consultations & legal support" })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground gap-2 shadow-primary group"
                asChild
              >
                <Link to="/consultation">
                  <Phone className="h-5 w-5" />
                  <span>{t("nav.free_consultation", { defaultValue: "Consultation Gratuite" })}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 gap-2"
                asChild
              >
                <Link to="/services">
                  {t("common.discover_services", { defaultValue: "Découvrir nos Services" })}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-primary">
                  <AnimatedCounter value={500} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">{t("stats.clients_supported", { defaultValue: "Clients Accompagnés" })}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-primary">
                  <AnimatedCounter value={1000} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">{t("stats.cases_handled", { defaultValue: "Dossiers Traités" })}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-primary">
                  <AnimatedCounter value={95} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">{t("stats.success_rate", { defaultValue: "Taux de Réussite" })}</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:ml-auto animate-fade-in">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-30 animate-pulse" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Replace the single hero image with a full-size carousel */}
              <SimpleCarousel className="w-full h-96 md:h-[480px] lg:h-[560px]" />
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};
