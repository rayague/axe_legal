import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import processHero from "@/assets/real-estate-law.jpg";
import { 
  Phone, 
  MessageSquare, 
  FileText, 
  Scale, 
  CheckCircle, 
  Users,
  ArrowRight,
  Clock,
  Shield,
  Target,
  Sparkles,
  Award,
  TrendingUp,
  LucideIcon,
  GitBranch
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProcessSteps } from "@/lib/firebaseApi";
import { pickLocalizedString, getCurrentLang } from "@/lib/i18nFields";
import { useTranslation } from "react-i18next";

interface ProcessStep {
  id?: string;
  title: string;
  description: string;
  order: number;
  iconName?: string;
  duration?: string;
  details?: string[];
  color?: string;
}

interface EnrichedProcessStep extends ProcessStep {
  icon: LucideIcon;
  number: string;
}

// Map icon names to actual icon components
const iconMap: { [key: string]: LucideIcon } = {
  Phone,
  MessageSquare,
  FileText,
  Scale,
  CheckCircle,
  Users,
  Clock,
  Shield,
  Target,
  Award,
  TrendingUp,
  Sparkles,
  GitBranch,
  Zap: Sparkles, // Fallback si Zap n'est pas importé
  Heart: Users, // Fallback
  Star: Award // Fallback
};

const getIconFromName = (iconName?: string): LucideIcon => {
  if (!iconName) return Phone;
  return iconMap[iconName] || Phone;
};

const getDefaultProcessSteps = (t: (key: string, options?: any) => string): EnrichedProcessStep[] => [
  {
    icon: Phone,
    number: "01",
    title: t("pages.process.steps.0.title", { defaultValue: "Premier Contact" }),
    description: t("pages.process.steps.0.description", { defaultValue: "Contactez-nous par téléphone, email ou via notre formulaire en ligne. Nous vous répondons sous 24h pour une première prise de contact." }),
    details: [
      t("pages.process.steps.0.details.0", { defaultValue: "Prise de contact initiale rapide" }),
      t("pages.process.steps.0.details.1", { defaultValue: "Écoute attentive de votre situation" }),
      t("pages.process.steps.0.details.2", { defaultValue: "Évaluation préliminaire de vos besoins" }),
      t("pages.process.steps.0.details.3", { defaultValue: "Orientation vers le bon expert" })
    ],
    duration: t("pages.process.steps.0.duration", { defaultValue: "24h" }),
    color: "from-blue-500/10 to-blue-600/10"
  },
  {
    icon: MessageSquare,
    number: "02",
    title: t("pages.process.steps.1.title", { defaultValue: "Consultation Gratuite" }),
    description: t("pages.process.steps.1.description", { defaultValue: "Bénéficiez d'une première consultation gratuite pour analyser votre cas en détail et identifier les meilleures solutions." }),
    details: [
      t("pages.process.steps.1.details.0", { defaultValue: "Rencontre sans engagement financier" }),
      t("pages.process.steps.1.details.1", { defaultValue: "Analyse approfondie de votre dossier" }),
      t("pages.process.steps.1.details.2", { defaultValue: "Conseils juridiques préliminaires" }),
      t("pages.process.steps.1.details.3", { defaultValue: "Questions-réponses personnalisées" })
    ],
    duration: t("pages.process.steps.1.duration", { defaultValue: "1h" }),
    color: "from-purple-500/10 to-purple-600/10"
  },
  {
    icon: FileText,
    number: "03",
    title: t("pages.process.steps.2.title", { defaultValue: "Proposition de Service" }),
    description: t("pages.process.steps.2.description", { defaultValue: "Nous vous présentons une proposition détaillée avec une stratégie claire et des honoraires transparents, sans surprises." }),
    details: [
      t("pages.process.steps.2.details.0", { defaultValue: "Stratégie juridique personnalisée" }),
      t("pages.process.steps.2.details.1", { defaultValue: "Honoraires transparents et détaillés" }),
      t("pages.process.steps.2.details.2", { defaultValue: "Délais estimés avec précision" }),
      t("pages.process.steps.2.details.3", { defaultValue: "Plan d'action étape par étape" })
    ],
    duration: t("pages.process.steps.2.duration", { defaultValue: "2-3 jours" }),
    color: "from-green-500/10 to-green-600/10"
  },
  {
    icon: Scale,
    number: "04",
    title: t("pages.process.steps.3.title", { defaultValue: "Action Juridique" }),
    description: t("pages.process.steps.3.description", { defaultValue: "Notre équipe met en œuvre la stratégie définie avec rigueur, professionnalisme et une communication régulière." }),
    details: [
      t("pages.process.steps.3.details.0", { defaultValue: "Rédaction des actes juridiques" }),
      t("pages.process.steps.3.details.1", { defaultValue: "Représentation légale complète" }),
      t("pages.process.steps.3.details.2", { defaultValue: "Suivi régulier et points d'étape" }),
      t("pages.process.steps.3.details.3", { defaultValue: "Communication transparente" })
    ],
    duration: t("pages.process.steps.3.duration", { defaultValue: "Variable" }),
    color: "from-orange-500/10 to-orange-600/10"
  },
  {
    icon: CheckCircle,
    number: "05",
    title: t("pages.process.steps.4.title", { defaultValue: "Résolution & Finalisation" }),
    description: t("pages.process.steps.4.description", { defaultValue: "Nous assurons le suivi jusqu'à la résolution complète de votre dossier avec vérification minutieuse des résultats." }),
    details: [
      t("pages.process.steps.4.details.0", { defaultValue: "Finalisation complète du dossier" }),
      t("pages.process.steps.4.details.1", { defaultValue: "Vérification des résultats obtenus" }),
      t("pages.process.steps.4.details.2", { defaultValue: "Archivage sécurisé des documents" }),
      t("pages.process.steps.4.details.3", { defaultValue: "Remise des documents finaux" })
    ],
    duration: t("pages.process.steps.4.duration", { defaultValue: "1-2 semaines" }),
    color: "from-teal-500/10 to-teal-600/10"
  },
  {
    icon: Users,
    number: "06",
    title: t("pages.process.steps.5.title", { defaultValue: "Accompagnement Continu" }),
    description: t("pages.process.steps.5.description", { defaultValue: "Nous restons à vos côtés pour tout besoin juridique futur et vous accompagnons dans la durée." }),
    details: [
      t("pages.process.steps.5.details.0", { defaultValue: "Relation de confiance pérenne" }),
      t("pages.process.steps.5.details.1", { defaultValue: "Disponibilité permanente" }),
      t("pages.process.steps.5.details.2", { defaultValue: "Conseils préventifs réguliers" }),
      t("pages.process.steps.5.details.3", { defaultValue: "Support juridique continu" })
    ],
    duration: t("pages.process.steps.5.duration", { defaultValue: "Long terme" }),
    color: "from-pink-500/10 to-pink-600/10"
  },
];

const getGuarantees = (t: (key: string, options?: any) => string) => [
  {
    icon: Clock,
    title: t("pages.process.guarantees.0.title", { defaultValue: "Réactivité Garantie" }),
    description: t("pages.process.guarantees.0.description", { defaultValue: "Réponse sous 24h à toute demande" })
  },
  {
    icon: Shield,
    title: t("pages.process.guarantees.1.title", { defaultValue: "Confidentialité Totale" }),
    description: t("pages.process.guarantees.1.description", { defaultValue: "Protection absolue de vos informations" })
  },
  {
    icon: Target,
    title: t("pages.process.guarantees.2.title", { defaultValue: "Résultats Concrets" }),
    description: t("pages.process.guarantees.2.description", { defaultValue: "Objectifs clairs et mesurables" })
  },
  {
    icon: Award,
    title: t("pages.process.guarantees.3.title", { defaultValue: "Excellence Juridique" }),
    description: t("pages.process.guarantees.3.description", { defaultValue: "Expertise reconnue et certifiée" })
  },
  {
    icon: Scale,
    title: t("pages.process.guarantees.4.title", { defaultValue: "Respect de vos droits" }),
    description: t("pages.process.guarantees.4.description", { defaultValue: "Engagement ferme au respect de vos droits" })
  },
  {
    icon: Shield,
    title: t("pages.process.guarantees.5.title", { defaultValue: "Intégrité" }),
    description: t("pages.process.guarantees.5.description", { defaultValue: "Une conduite irréprochable fondée sur l'éthique" })
  },
  {
    icon: GitBranch,
    title: t("pages.process.guarantees.6.title", { defaultValue: "Responsabilité professionnelle" }),
    description: t("pages.process.guarantees.6.description", { defaultValue: "Sens élevé de responsabilité professionnelle" })
  },
  {
    icon: CheckCircle,
    title: t("pages.process.guarantees.7.title", { defaultValue: "Bonne foi" }),
    description: t("pages.process.guarantees.7.description", { defaultValue: "Transparence et loyauté dans chaque démarche" })
  }
];

export default function Process() {
  const [dbProcessSteps, setDbProcessSteps] = useState<ProcessStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const currentLang = getCurrentLang(i18n);

  useEffect(() => {
    fetchProcessSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProcessSteps = async () => {
    try {
      setIsLoading(true);
      const data = await getProcessSteps();
      console.log('Données Firebase reçues:', data);
      setDbProcessSteps(data as ProcessStep[]);
    } catch (error) {
      console.error('Error fetching process steps:', error);
      toast({
        variant: "destructive",
        title: t("common.error", { defaultValue: "Erreur" }),
        description: t("pages.process.toast_error_desc", { defaultValue: "Impossible de charger les étapes du processus" })
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enrichir les étapes de la base de données avec les icônes
  const enrichProcessSteps = (steps: ProcessStep[]): EnrichedProcessStep[] => {
    return steps
      .sort((a, b) => a.order - b.order)
      .map((step, index) => ({
        ...step,
        title: pickLocalizedString(step.title, currentLang),
        description: pickLocalizedString(step.description, currentLang),
        icon: getIconFromName(step.iconName),
        number: String(index + 1).padStart(2, '0'),
        // Utiliser les valeurs de la DB, sinon valeurs par défaut
        duration: step.duration || t("pages.process.steps.3.duration", { defaultValue: "Variable" }),
        color: step.color || "from-blue-500/10 to-blue-600/10",
        details: step.details || []
      }));
  };

  // Utiliser les données Firebase si disponibles, sinon les données par défaut
  const processSteps = dbProcessSteps.length > 0 ? enrichProcessSteps(dbProcessSteps) : getDefaultProcessSteps(t);
  const guarantees = getGuarantees(t);

  console.log('Process Page - DB steps:', dbProcessSteps.length, 'Final steps:', processSteps.length);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <PageHero
          eyebrow={t("pages.process.hero_eyebrow", { defaultValue: "Notre Processus" })}
          title={(
            <>
              {t("pages.process.hero_title_prefix", { defaultValue: "Un Accompagnement" })}{" "}
              <span className="text-yellow-400">{t("pages.process.hero_title_highlight", { defaultValue: "Structuré" })}</span>
            </>
          )}
          subtitle={t("pages.process.hero_subtitle", { defaultValue: "Découvrez notre méthodologie éprouvée en 6 étapes pour vous garantir un accompagnement juridique d'excellence, du premier contact jusqu'à la résolution de votre dossier." })}
          ctaText={t("pages.process.hero_cta", { defaultValue: "Démarrer maintenant" })}
          ctaLink="/contact"
          imageSrc={processHero}
          large
        />

        {/* Introduction Section */}
        <section className="py-16 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="mb-4" variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                {t("pages.process.intro_badge", { defaultValue: "Méthodologie Éprouvée" })}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t("pages.process.intro_title_prefix", { defaultValue: "Une Approche" })}{" "}
                <span className="text-primary">{t("pages.process.intro_title_highlight", { defaultValue: "Professionnelle" })}</span>{" "}
                {t("pages.process.intro_title_suffix", { defaultValue: "en 6 Étapes" })}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("pages.process.intro_paragraph", { defaultValue: "Notre processus a été conçu pour vous offrir clarté, transparence et efficacité à chaque étape. De la première prise de contact à l'accompagnement continu, nous vous guidons avec rigueur et professionnalisme pour atteindre vos objectifs juridiques." })}
              </p>
            </div>
          </div>
        </section>

        {/* Process Steps - Timeline Design */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">{t("pages.process.loading", { defaultValue: "Chargement des étapes..." })}</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline Line - Hidden on mobile */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-primary/10 transform -translate-x-1/2"></div>

                  <div className="space-y-12">
                    {processSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isEven = index % 2 === 0;
                      
                      return (
                        <div
                          key={step.id}
                          className="relative animate-fade-in-up"
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <div className={`grid md:grid-cols-2 gap-8 items-start ${isEven ? '' : 'md:flex-row-reverse'}`}>
                            {/* Left Side */}
                            <div className={`${isEven ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12'} space-y-2`}>
                              <Badge className={`inline-flex bg-gradient-to-r ${step.color} border-primary/30`}>
                                <Clock className="h-3 w-3 mr-1" />
                                {step.duration}
                              </Badge>
                              <h3 className="text-2xl md:text-3xl font-bold">
                                {step.title}
                              </h3>
                            </div>

                            {/* Center Icon - Desktop Only */}
                            <div className="hidden md:block absolute left-1/2 top-0 transform -translate-x-1/2 z-10">
                              <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl border-4 border-background">
                                  <Icon className="h-9 w-9 text-white" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-sm text-accent-foreground">
                                  {step.number}
                                </div>
                              </div>
                            </div>

                            {/* Right Side - Card */}
                            <div className={isEven ? 'md:order-2' : ''}>
                              <Card className={`p-6 md:p-8 group hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 bg-gradient-to-br ${step.color} hover:scale-[1.02]`}>
                                {/* Mobile Icon */}
                                <div className="md:hidden flex items-center gap-4 mb-4">
                                  <div className="relative flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                                      <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center font-bold text-xs text-accent-foreground">
                                      {step.number}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <Badge className="mb-2">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {step.duration}
                                    </Badge>
                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                  </div>
                                </div>

                                <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                                  {step.description}
                                </p>

                                {step.details && step.details.length > 0 && (
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                      <div className="h-1 w-8 bg-primary rounded"></div>
                                      {t("pages.process.key_points", { defaultValue: "Points Clés" })}
                                    </h4>
                                    <ul className="space-y-2">
                                      {step.details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                          <div className="mt-1 flex-shrink-0">
                                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                                              <CheckCircle className="h-3 w-3 text-primary" />
                                            </div>
                                          </div>
                                          <span className="text-muted-foreground flex-1">{detail}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </Card>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Guarantees Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                {t("pages.process.guarantees_badge", { defaultValue: "Nos Garanties" })}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("pages.process.guarantees_title_prefix", { defaultValue: "Nos" })}{" "}
                <span className="text-primary">{t("pages.process.guarantees_title_highlight", { defaultValue: "Engagements" })}</span>{" "}
                {t("pages.process.guarantees_title_suffix", { defaultValue: "envers Vous" })}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("pages.process.guarantees_subtitle", { defaultValue: "Des garanties concrètes pour vous assurer un service de qualité exceptionnelle" })}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {guarantees.map((guarantee, index) => (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 group bg-background/80 backdrop-blur"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-all group-hover:scale-110">
                    <guarantee.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {guarantee.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {guarantee.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {t("pages.process.stats_title", { defaultValue: "Des Résultats qui Parlent d'Eux-Mêmes" })}
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto">
                  {t("pages.process.stats_subtitle", { defaultValue: "Notre processus éprouvé génère des résultats concrets et mesurables" })}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-5xl font-extrabold text-white mb-2">95%</div>
                  <div className="text-white/90 font-medium mb-2">{t("pages.process.stats_satisfaction", { defaultValue: "Taux de Satisfaction" })}</div>
                  <p className="text-white/70 text-sm">{t("pages.process.stats_satisfaction_note", { defaultValue: "Clients satisfaits de notre processus" })}</p>
                </div>

                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-5xl font-extrabold text-white mb-2">24h</div>
                  <div className="text-white/90 font-medium mb-2">{t("pages.process.stats_response_time", { defaultValue: "Temps de Réponse" })}</div>
                  <p className="text-white/70 text-sm">{t("pages.process.stats_response_time_note", { defaultValue: "Réactivité garantie sur toute demande" })}</p>
                </div>

                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-5xl font-extrabold text-white mb-2">1000+</div>
                  <div className="text-white/90 font-medium mb-2">{t("pages.process.stats_cases", { defaultValue: "Dossiers Réussis" })}</div>
                  <p className="text-white/70 text-sm">{t("pages.process.stats_cases_note", { defaultValue: "Grâce à notre méthodologie" })}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 to-background">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Phone className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold">
                  {t("pages.process.cta_title_prefix", { defaultValue: "Prêt à Démarrer" })}{" "}
                  <span className="text-primary">{t("pages.process.cta_title_highlight", { defaultValue: "Votre Projet Juridique" })}</span>{" "}
                  {t("pages.process.cta_title_suffix", { defaultValue: "?" })}
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t("pages.process.cta_subtitle", { defaultValue: "Contactez-nous dès aujourd'hui pour bénéficier de notre première consultation gratuite et découvrir comment notre processus peut vous aider à atteindre vos objectifs juridiques." })}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="group" asChild>
                    <Link to="/contact">
                      {t("pages.process.cta_primary", { defaultValue: "Consultation Gratuite" })}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/services">
                      {t("common.discover_services", { defaultValue: "Découvrir nos Services" })}
                    </Link>
                  </Button>
                </div>

                <div className="pt-6 border-t border-primary/20 mt-8">
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{t("pages.process.cta_pill_no_commitment", { defaultValue: "Sans engagement" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{t("pages.process.cta_pill_24h", { defaultValue: "Réponse sous 24h" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{t("pages.process.cta_pill_confidentiality", { defaultValue: "Confidentialité garantie" })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
