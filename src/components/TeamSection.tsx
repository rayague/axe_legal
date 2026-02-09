import { Card } from "@/components/ui/card";
import { Users, TrendingUp, FileText, BarChart } from "lucide-react";
import teamLeader from "@/assets/team-leader.jpg";
import teamFiscal from "@/assets/team-fiscal.jpg";
import teamLegal from "@/assets/team-legal.jpg";
import teamFinance from "@/assets/team-finance.jpg";

const teamMembers = [
  {
    title: "l'Associé-Gérant",
    subtitle: "Direction & Stratégie",
    description:
      "Pilote la stratégie globale du cabinet et assure la direction des opérations avec une vision d'excellence et d'innovation juridique.",
    icon: Users,
    image: teamLeader,
  },
  {
    title: "Cellule de l'Intelligence Fiscale",
    subtitle: "Optimisation & Défense Fiscale",
    description:
      "Expertise pointue en fiscalité, optimisation fiscale et défense des intérêts face aux administrations fiscales.",
    icon: TrendingUp,
    image: teamFiscal,
  },
  {
    title: "Cellule des Actes Juridiques et de la Gouvernance d'Entreprise",
    subtitle: "Gouvernance d'Entreprise",
    description:
      "Spécialisée dans la rédaction d'actes juridiques, la gouvernance d'entreprise et l'accompagnement des structures organisationnelles.",
    icon: FileText,
    image: teamLegal,
  },
  {
    title: "Cellule de Traitement de l'Information Financière",
    subtitle: "Analyse & Intelligence Financière",
    description:
      "Expertise en analyse financière, traitement de données et intelligence économique pour optimiser les décisions stratégiques.",
    icon: BarChart,
    image: teamFinance,
  },
];

export const TeamSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold mb-2">Notre Équipe</p>
          <h2 className="text-3xl lg:text-4xl font-bold">Experts Juridiques de Renom</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
            Une équipe pluridisciplinaire de professionnels du droit, reconnus pour leur expertise et
            leur engagement envers l'excellence juridique.
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
