import AnimatedCounter from "./AnimatedCounter";
import { useTranslation } from "react-i18next";

export const StatsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="stats py-16 bg-gradient-to-b from-primary to-primary-dark text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t("stats_section.title", { defaultValue: "Notre Impact en Chiffres" })}</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t("stats_section.subtitle", { defaultValue: "Des résultats concrets qui témoignent de notre engagement envers l'excellence" })}
          </p>
        </div>
        
        <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white">
              <AnimatedCounter value={500} suffix="+" />
            </div>
            <div className="text-sm text-white/80">{t("stats.clients_supported", { defaultValue: "Clients Accompagnés" })}</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white">
              <AnimatedCounter value={1000} suffix="+" />
            </div>
            <div className="text-sm text-white/80">{t("stats.cases_handled", { defaultValue: "Dossiers Traités" })}</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white">
              <AnimatedCounter value={95} suffix="%" />
            </div>
            <div className="text-sm text-white/80">{t("stats.success_rate", { defaultValue: "Taux de Réussite" })}</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white">
              <AnimatedCounter value={5} suffix="+" />
            </div>
            <div className="text-sm text-white/80">{t("stats.years_experience", { defaultValue: "Années d'Expérience" })}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
