import { Card } from "@/components/ui/card";
import { Award, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export const CertificationsSection = () => {
  const { t } = useTranslation();

  const certifications = [
    {
      icon: Award,
      title: t("certifications.items.0.title", { defaultValue: "Droit des Affaires" }),
      subtitle: t("certifications.items.0.subtitle", { defaultValue: "Expert en droit des affaires et contrats commerciaux" }),
      color: "primary",
    },
    {
      icon: Lock,
      title: t("certifications.items.2.title", { defaultValue: "Confidentialité" }),
      subtitle: t("certifications.items.2.subtitle", { defaultValue: "Garantie absolue" }),
      color: "primary",
    },
  ];

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t("certifications.title", { defaultValue: "Reconnu et Certifié" })}</h2>
          <p className="text-lg text-white/90">
            {t("certifications.subtitle", { defaultValue: "Notre expertise juridique reconnue au service de votre réussite" })}
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {certifications.map((cert, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-8 text-center space-y-4">
                <div className="inline-flex p-4 bg-white/10 rounded-2xl">
                  <cert.icon className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1 text-white">{cert.title}</h3>
                  <p className="text-white/80">{cert.subtitle}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
