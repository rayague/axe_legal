import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc?: string;
  imageAlt?: string;
  reverse?: boolean;
  large?: boolean;
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  subtitle,
  ctaText,
  ctaLink,
  imageSrc,
  imageAlt,
  reverse,
  large,
}) => {
  return (
    <section 
      style={{ paddingTop: 'var(--site-header-height, 56px)' }} 
      className={large ? "relative min-h-[500px] sm:min-h-[60vh] lg:min-h-[70vh]" : "py-12 sm:py-16 lg:py-20 bg-background"}
    >
      {large && (
        <div className="absolute inset-0 z-0">
          {imageSrc && (
            <img src={imageSrc} alt={imageAlt || "hero"} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-primary/85 mix-blend-multiply" />
          <div className="absolute inset-0 hero-dots opacity-30 pointer-events-none" />
        </div>
      )}

      <div className={`container mx-auto px-4 ${large ? "relative z-10 flex items-center min-h-[500px] sm:min-h-[60vh] lg:min-h-[70vh]" : "py-8 sm:py-12 lg:py-20"}`}>
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${reverse ? "lg:flex-row-reverse" : ""} w-full`}>
          <div className={large ? "space-y-4 sm:space-y-6 text-center lg:text-left py-8 sm:py-0" : "space-y-4 sm:space-y-6"}>
            {eyebrow && (
              <p className={large ? "text-sm sm:text-base text-accent font-semibold" : "text-accent font-semibold"}>
                {eyebrow}
              </p>
            )}
            
            <h1 className={
              large 
                ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white" 
                : "text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            }>
              {title}
            </h1>
            
            {subtitle && (
              <p className={
                large 
                  ? "text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed" 
                  : "text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
              }>
                {subtitle}
              </p>
            )}

            {ctaText && ctaLink && (
              <div className="flex gap-4 pt-2 sm:pt-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className={
                    large 
                      ? "bg-white text-primary hover:bg-white/90 shadow-lg group" 
                      : "bg-primary hover:bg-primary/90 group"
                  } 
                  asChild
                >
                  <Link to={ctaLink}>
                    {ctaText}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {!large && imageSrc && (
            <div className="relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={imageSrc} alt={imageAlt || "hero"} className="w-full h-80 object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
