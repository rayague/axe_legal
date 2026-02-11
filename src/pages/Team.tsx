import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  FileText, 
  BarChart, 
  Award,
  Target,
  Lightbulb,
  Shield,
  CheckCircle,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Trophy,
  Mail,
  Phone,
  Linkedin,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import { getTeamMembers } from "@/lib/firebaseApi";
import { pickLocalizedString, getCurrentLang } from "@/lib/i18nFields";
import teamLeader from "@/assets/team-leader.jpg";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const currentLang = getCurrentLang(i18n);

  useEffect(() => {
    fetchTeamMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const data = await getTeamMembers();
      setTeamMembers(data as TeamMember[]);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: t("common.error", { defaultValue: "Erreur" }),
        description: t("pages.team.toast_error_desc", { defaultValue: "Impossible de charger les membres de l'équipe" }),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const values = [
    {
      icon: Award,
      title: t("pages.team.values.0.title", { defaultValue: "Excellence" }),
      description: t("pages.team.values.0.desc", { defaultValue: "Nous visons la perfection dans chaque dossier et nous engageons à fournir des prestations juridiques de la plus haute qualité." })
    },
    {
      icon: Shield,
      title: t("pages.team.values.1.title", { defaultValue: "Intégrité" }),
      description: t("pages.team.values.1.desc", { defaultValue: "L'éthique et la transparence guident toutes nos actions. Nous construisons des relations de confiance durables avec nos clients." })
    },
    {
      icon: Lightbulb,
      title: t("pages.team.values.2.title", { defaultValue: "Innovation" }),
      description: t("pages.team.values.2.desc", { defaultValue: "Nous adoptons les technologies juridiques modernes pour offrir des solutions efficaces et adaptées aux enjeux contemporains." })
    },
    {
      icon: Target,
      title: t("pages.team.values.3.title", { defaultValue: "Résultats" }),
      description: t("pages.team.values.3.desc", { defaultValue: "Notre focus est mis sur l'atteinte des objectifs de nos clients avec des stratégies éprouvées et une exécution rigoureuse." })
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <PageHero
          eyebrow={t("pages.team.hero_eyebrow", { defaultValue: "Notre Équipe" })}
          title={(
            <>
              {t("pages.team.hero_title_prefix", { defaultValue: "Une Équipe d'" })}<span className="text-yellow-400">{t("pages.team.hero_title_highlight", { defaultValue: "Experts" })}</span><br />
              {t("pages.team.hero_title_suffix", { defaultValue: "à Votre Service" })}
            </>
          )}
          subtitle={t("pages.team.hero_subtitle", { defaultValue: "Des professionnels du droit hautement qualifiés, organisés en cellules spécialisées pour vous offrir une expertise complète et une approche pluridisciplinaire de vos problématiques juridiques." })}
          ctaText={t("pages.team.hero_cta", { defaultValue: "Rencontrer l'équipe" })}
          ctaLink="/contact"
          imageSrc={teamLeader}
          large
        />

        {/* Introduction Section */}
        <section className="py-16 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="mb-4" variant="outline">
                <Trophy className="h-4 w-4 mr-2" />
                {t("pages.team.intro_badge", { defaultValue: "Excellence & Expertise" })}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t("pages.team.intro_title_prefix", { defaultValue: "Une Organisation au Service de" })}{" "}
                <span className="text-primary">{t("pages.team.intro_title_highlight", { defaultValue: "Votre Réussite" })}</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("pages.team.intro_paragraph", { defaultValue: "Notre cabinet s'appuie sur une structure organisationnelle innovante, avec des cellules spécialisées qui travaillent en synergie pour vous apporter des solutions juridiques complètes et performantes. Chaque cellule regroupe des experts reconnus dans leur domaine, garantissant une expertise pointue et une réactivité optimale." })}
              </p>
            </div>
          </div>
        </section>

        {/* Team Members Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("pages.team.grid_title", { defaultValue: "Notre Équipe de Juristes" })}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("pages.team.grid_subtitle", { defaultValue: "Découvrez les professionnels du droit qui composent notre équipe et leurs domaines d'expertise" })}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">{t("pages.team.loading", { defaultValue: "Chargement de l'équipe..." })}</p>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("pages.team.empty", { defaultValue: "Aucun membre de l'équipe à afficher pour le moment." })}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {teamMembers.map((member, index) => (
                  <Card
                    key={member.id}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-500 group animate-fade-in-up border-2 hover:border-primary/50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-24 w-24 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                      
                      {/* Badge Role */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary/90 backdrop-blur-sm">
                          {pickLocalizedString(member.role, currentLang)}
                        </Badge>
                      </div>

                      {/* Nom en bas */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-foreground mb-1">
                          {member.name}
                        </h3>
                        <p className="text-primary font-semibold">{pickLocalizedString(member.role, currentLang)}</p>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {pickLocalizedString(member.bio, currentLang)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
          {/* Motif de fond */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t("stats_section.title", { defaultValue: "Notre Impact en Chiffres" })}
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto">
                {t("pages.team.stats_subtitle", { defaultValue: "Des résultats concrets qui témoignent de notre engagement et de notre expertise" })}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center animate-scale-in bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-5xl font-extrabold text-white mb-2">
                  <AnimatedCounter value={150} suffix="+" />
                </div>
                <div className="text-white/90 font-medium">{t("stats.clients_supported", { defaultValue: "Clients Accompagnés" })}</div>
                <p className="text-white/70 text-sm mt-2">{t("pages.team.stats_clients_note", { defaultValue: "Entreprises et particuliers" })}</p>
              </div>
              
              <div className="text-center animate-scale-in bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20" style={{ animationDelay: "100ms" }}>
                <div className="text-5xl font-extrabold text-white mb-2">
                  <AnimatedCounter value={500} suffix="+" />
                </div>
                <div className="text-white/90 font-medium">{t("stats.cases_handled", { defaultValue: "Dossiers Traités" })}</div>
                <p className="text-white/70 text-sm mt-2">{t("pages.team.stats_cases_note", { defaultValue: "Avec succès et rigueur" })}</p>
              </div>
              
              <div className="text-center animate-scale-in bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20" style={{ animationDelay: "200ms" }}>
                <div className="text-5xl font-extrabold text-white mb-2">
                  <AnimatedCounter value={95} suffix="%" />
                </div>
                <div className="text-white/90 font-medium">{t("stats.success_rate", { defaultValue: "Taux de Réussite" })}</div>
                <p className="text-white/70 text-sm mt-2">{t("pages.team.stats_success_note", { defaultValue: "Satisfaction garantie" })}</p>
              </div>
              
              <div className="text-center animate-scale-in bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20" style={{ animationDelay: "300ms" }}>
                <div className="text-5xl font-extrabold text-white mb-2">
                  <AnimatedCounter value={5} suffix="+" />
                </div>
                <div className="text-white/90 font-medium">{t("stats.years_experience", { defaultValue: "Années d'Expérience" })}</div>
                <p className="text-white/70 text-sm mt-2">{t("pages.team.stats_years_note", { defaultValue: "Expertise éprouvée" })}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">
                <Briefcase className="h-4 w-4 mr-2" />
                {t("pages.team.values_badge", { defaultValue: "Nos Valeurs" })}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("pages.team.values_title_prefix", { defaultValue: "Les Piliers de Notre" })}{" "}
                <span className="text-primary">{t("pages.team.values_title_highlight", { defaultValue: "Engagement" })}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("pages.team.values_subtitle", { defaultValue: "Des valeurs fortes qui guident notre action quotidienne et façonnent notre relation avec nos clients" })}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center border-2 border-primary/20 shadow-xl">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold">
                  Rencontrons-nous pour Discuter de <span className="text-primary">Votre Projet</span>
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Notre équipe est à votre disposition pour analyser votre situation, comprendre vos besoins 
                  et vous proposer des solutions juridiques sur mesure. Prenez rendez-vous dès aujourd'hui.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="group" asChild>
                    <Link to="/contact">
                      Prendre Rendez-vous
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/services">
                      Découvrir Nos Services
                    </Link>
                  </Button>
                </div>

                <div className="pt-6 border-t border-primary/20 mt-8">
                  <p className="text-sm text-muted-foreground">
                    💼 Première consultation offerte • 📞 Disponibles 24/7 • ✓ Réponse garantie sous 24h
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section> */}
      </main>

      <Footer />
    </div>
  );
}
