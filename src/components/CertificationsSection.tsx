import { Card } from "@/components/ui/card";
import { Award, Shield, Lock } from "lucide-react";

export const CertificationsSection = () => {
  const certifications = [
    {
      icon: Award,
      title: "Droit des Affaires",
      subtitle: "Expert en droit des affaires et contrats commerciaux",
      color: "primary",
    },
    {
      icon: Shield,
      title: "Excellence",
      subtitle: "Prix du meilleur cabinet 2023",
      color: "accent",
    },
    {
      icon: Lock,
      title: "Confidentialité",
      subtitle: "Garantie absolue",
      color: "primary",
    },
  ];

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Reconnu et Certifié</h2>
          <p className="text-lg text-white/90">
            Notre expertise juridique reconnue au service de votre réussite
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
