import { Card } from "@/components/ui/card";
import { 
  Target, 
  HeartHandshake, 
  TrendingUp, 
  Shield, 
  Clock, 
  Award 
} from "lucide-react";

export const WhyChooseUsSection = () => {
  const reasons = [
    {
      icon: Target,
      title: "Expertise Ciblée",
      description: "Une connaissance approfondie du droit béninois et des réalités locales pour des conseils précis et adaptés.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: HeartHandshake,
      title: "Approche Humaine",
      description: "Nous plaçons la relation client au cœur de notre pratique avec écoute, empathie et transparence totale.",
      color: "from-rose-500 to-rose-600"
    },
    {
      icon: TrendingUp,
      title: "Résultats Probants",
      description: "95% de taux de réussite grâce à notre stratégie juridique rigoureuse et notre engagement sans faille.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      title: "Confidentialité Absolue",
      description: "Protection maximale de vos informations avec le secret professionnel le plus strict garanti.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Disponibilité 24/7",
      description: "Une équipe réactive disponible pour les urgences juridiques, même en dehors des heures de bureau.",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: Award,
      title: "Excellence Reconnue",
      description: "Cabinet primé et recommandé par nos clients pour la qualité exceptionnelle de nos prestations.",
      color: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pourquoi Choisir Axe Legal ?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez les valeurs et engagements qui font de nous votre partenaire juridique de confiance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <Card
              key={index}
              className="group p-6 hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${reason.color} transform transition-transform duration-300 group-hover:scale-110`}>
                  <reason.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {reason.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
