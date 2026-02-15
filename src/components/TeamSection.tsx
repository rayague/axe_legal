import { Card } from "@/components/ui/card";
import { Users, TrendingUp, FileText, BarChart } from "lucide-react";
import { useTranslation } from "react-i18next";
import teamLeader from "@/assets/team-leader.jpg";
import teamFiscal from "@/assets/team-fiscal.jpg";
import teamLegal from "@/assets/team-legal.jpg";
import teamFinance from "@/assets/team-finance.jpg";

export const TeamSection = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      title: t("team_section.members.0.title", { defaultValue: "l'Associé-Gérant" }),
      subtitle: t("team_section.members.0.subtitle", { defaultValue: "Direction & Stratégie" }),
      description: t("team_section.members.0.description", { defaultValue: "Pilote la stratégie globale du cabinet et assure la direction des opérations avec une vision d'excellence et d'innovation juridique." }),
      icon: Users,
      image: teamLeader,
    },
    {
      title: t("team_section.members.1.title", { defaultValue: "Cellule de l'Intelligence Fiscale" }),
      subtitle: t("team_section.members.1.subtitle", { defaultValue: "Optimisation & Défense Fiscale" }),
      description: t("team_section.members.1.description", { defaultValue: "Expertise pointue en fiscalité, optimisation fiscale et défense des intérêts auprès de l'administration fiscale." }),
      icon: TrendingUp,
      image: teamFiscal,
    },
    {
      title: t("team_section.members.2.title", { defaultValue: "Cellule des Actes Juridiques et de la Gouvernance d'Entreprise" }),
      subtitle: t("team_section.members.2.subtitle", { defaultValue: "Gouvernance d'Entreprise" }),
      description: t("team_section.members.2.description", { defaultValue: "Spécialisée dans la rédaction d'actes juridiques, la gouvernance d'entreprise et l'accompagnement des organisations." }),
      icon: FileText,
      image: teamLegal,
    },
    {
      title: t("team_section.members.3.title", { defaultValue: "Cellule de Traitement de l'Information Financière" }),
      subtitle: t("team_section.members.3.subtitle", { defaultValue: "Analyse & Intelligence Financière" }),
      description: t("team_section.members.3.description", { defaultValue: "Expertise en analyse financière, traitement de données et intelligence économique pour optimiser les décisions stratégiques." }),
      icon: BarChart,
      image: teamFinance,
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold mb-2">{t("team_section.eyebrow", { defaultValue: "Notre Équipe" })}</p>
          <h2 className="text-3xl lg:text-4xl font-bold">{t("team_section.title", { defaultValue: "Experts Juridiques de Renom" })}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
            {t("team_section.subtitle", { defaultValue: "Une équipe pluridisciplinaire de professionnels du droit, reconnus pour leur expertise et leur engagement envers l'excellence juridique." })}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-2 border-transparent hover:border-primary/50"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/20 p-2 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-accent font-semibold">{member.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {member.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{member.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
