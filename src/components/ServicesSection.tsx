import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  Briefcase, 
  Calculator, 
  Home, 
  Users, 
  Coins,
  FileText,
  ArrowRight,
  Scale,
  Building,
  TrendingUp,
  Shield,
  BookOpen,
  Gavel,
  Heart,
  Globe,
  DollarSign,
  UserCheck,
  Award
} from "lucide-react";
import { getServices } from "@/lib/firebaseApi";
import businessLaw from "@/assets/business-law.jpg";
import taxLaw from "@/assets/tax-law.jpg";
import realEstateLaw from "@/assets/real-estate-law.jpg";
import laborLaw from "@/assets/labor-law.jpg";

// Map pour les icônes
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Calculator,
  Home,
  Users,
  Coins,
  FileText,
  Scale,
  Building,
  TrendingUp,
  Shield,
  BookOpen,
  Gavel,
  Heart,
  Globe,
  DollarSign,
  UserCheck,
  Award,
};

// Map pour les images par défaut selon la catégorie
const imageMap: Record<string, string> = {
  "Droit des affaires": businessLaw,
  "Droit fiscal": taxLaw,
  "Droit immobilier": realEstateLaw,
  "Droit du travail": laborLaw,
  "Droit de la famille": realEstateLaw,
  "Droit pénal": businessLaw,
  "Droit administratif": realEstateLaw,
  "Contentieux": businessLaw,
  "Conseil juridique": businessLaw,
};

interface Service {
  id?: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  description: string;
  features: string[];
  benefits: string[];
  category: string;
  pricing: string;
  duration: string;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export const ServicesSection = () => {
  const location = useLocation();
  const isServicesPage = location.pathname === '/services';
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data as Service[]);
      } catch (err) {
        console.error('Erreur lors du chargement des services:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des services...</p>
        </div>
      </div>
    );
  }

  if (error || services.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold mb-4">Aucun service disponible</h3>
        <p className="text-muted-foreground">
          {error 
            ? "Une erreur s'est produite lors du chargement des services." 
            : "Aucun service n'est actuellement disponible."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Briefcase;
            const image = imageMap[service.category] || businessLaw;
            
            return (
              <Card
                key={service.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in-up border-2 hover:border-primary/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary rounded-xl shadow-lg">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-muted-foreground">
                    {service.shortDescription}
                  </p>

                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2">
                      {service.features.slice(0, isServicesPage ? undefined : 5).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                      {!isServicesPage && service.features.length > 5 && (
                        <li className="text-sm text-muted-foreground italic">
                          + {service.features.length - 5} autres fonctionnalités
                        </li>
                      )}
                    </ul>
                  )}

                  {(service.pricing || service.duration) && (
                    <div className="flex gap-4 text-sm text-muted-foreground pt-2 border-t">
                      {service.pricing && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {service.pricing}
                        </span>
                      )}
                      {service.duration && (
                        <span className="flex items-center gap-1">
                          ⏱️ {service.duration}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
  );
};
