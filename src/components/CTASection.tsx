import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Calendar, MessageSquare, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-primary text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            {t("cta.title", { defaultValue: "Prêt à Résoudre Votre Problème Juridique ?" })}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {t("cta.subtitle", { defaultValue: "Ne laissez pas vos questions juridiques sans réponse. Notre équipe d'experts est prête à vous accompagner avec professionnalisme et dévouement." })}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 gap-2 shadow-xl group px-8"
              asChild
            >
              <Link to="/consultation">
                <Calendar className="h-5 w-5" />
                <span>{t("cta.book_free_consultation", { defaultValue: "Réserver une Consultation Gratuite" })}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary gap-2"
              asChild
            >
              <Link to="/contact">
                <MessageSquare className="h-5 w-5" />
                <span>{t("pages.not_found.contact", { defaultValue: "Nous contacter" })}</span>
              </Link>
            </Button>
          </div>

          <div className="pt-8 flex flex-col md:flex-row gap-6 justify-center items-center border-t border-white/20">
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6" />
              <div className="text-left">
                <p className="text-sm text-white/70">{t("common.call_us", { defaultValue: "Appelez-nous" })}</p>
                <div className="font-semibold text-lg leading-snug">
                  <div>+229 01 97 74 75 93</div>
                  <div>+229 01 65 65 68 25</div>
                  <div>+229 01 40 66 69 38</div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-12 bg-white/20"></div>
            
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6" />
              <div className="text-left">
                <p className="text-sm text-white/70">{t("common.write_us", { defaultValue: "Écrivez-nous" })}</p>
                <p className="font-semibold text-lg">contact@axelegal.bj</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm">{t("cta.available_now", { defaultValue: "Disponible maintenant pour vous assister" })}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
