import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import { 
  Scale,
  Heart,
  Home,
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Car,
  Building,
  CreditCard,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  ChevronRight,
  Info,
  LucideIcon
} from "lucide-react";
import heroLegal from "@/assets/hero-legal.jpg";
import { getLegalCategories, LegalCategory } from "@/lib/firebaseApi";
import { useToast } from "@/hooks/use-toast";

// Map icon names to actual icon components
const iconMap: { [key: string]: LucideIcon } = {
  Heart,
  Home,
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Car,
  Building,
  CreditCard,
  Scale
};

const getIconFromName = (iconName?: string): LucideIcon => {
  if (!iconName) return Scale;
  return iconMap[iconName] || Scale;
};

interface EnrichedCategory extends LegalCategory {
  icon: LucideIcon;
}

const LegalTech = () => {
  const [categories, setCategories] = useState<EnrichedCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<EnrichedCategory | null>(null);
  const [showGuidance, setShowGuidance] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getLegalCategories();
      console.log('📊 Catégories juridiques récupérées:', data);
      
      // Enrichir avec les icônes et filtrer les catégories actives
      const enriched = data
        .filter(cat => cat.isActive)
        .map(cat => ({
          ...cat,
          icon: getIconFromName(cat.iconName)
        }));
      
      setCategories(enriched);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories juridiques",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: EnrichedCategory) => {
    setSelectedCategory(category);
    setShowGuidance(true);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setShowGuidance(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          eyebrow="Assistant Juridique Intelligent"
          title={(
            <>
              Simulateur de <span className="text-yellow-400">Démarches</span><br />
              Juridiques
            </>
          )}
          subtitle={"Nos solutions numériques. Les outils juridiques automatisés qui vous font avancer et gagner du temps."}
          ctaText="Commencer la simulation"
          ctaLink="#simulation"
          imageSrc={heroLegal}
          large
        />

        {/* Annonce de lancement LegalTech */}
        <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background" id="announcement">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Badge d'annonce */}
              <div className="text-center mb-8 animate-pulse">
                <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-primary to-primary/80 text-white border-none shadow-lg">
                  <Scale className="h-5 w-5 mr-2" />
                  Nouveauté 2026
                </Badge>
              </div>

              {/* Titre principal */}
              <div className="text-center space-y-6 mb-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-yellow-400">
                    la LegalTech
                  </span>
                </h2>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Une plateforme qui vous offre des solutions pour réaliser de façon automatisée 
                  des travaux en droit et fiscalité des affaires.
                </p>
              </div>

              {/* Card principale avec informations */}
              <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12">
                  <CardHeader className="p-0 mb-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
                        <Scale className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-3xl md:text-4xl text-center mb-4">
                      Bientôt Disponible
                    </CardTitle>
                    <CardDescription className="text-center text-lg">
                      Notre assistant juridique intelligent arrive prochainement
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-0 space-y-8">
                    {/* Ce que vous pourrez faire */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-center mb-6">
                        Ce que vous pourrez faire :
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <p className="font-semibold mb-1">Simulateur de démarches</p>
                            <p className="text-sm text-muted-foreground">
                              Découvrez les étapes juridiques adaptées à votre situation
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <p className="font-semibold mb-1">Guidance personnalisée</p>
                            <p className="text-sm text-muted-foreground">
                              Obtenez des recommandations sur mesure pour vos besoins
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <p className="font-semibold mb-1">Documents intelligents</p>
                            <p className="text-sm text-muted-foreground">
                              Préparez automatiquement vos dossiers juridiques
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/10">
                          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <p className="font-semibold mb-1">Suivi en temps réel</p>
                            <p className="text-sm text-muted-foreground">
                              Suivez l'avancement de vos procédures juridiques
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alerte informative */}
                    <Alert className="border-primary/50 bg-primary/5">
                      <Info className="h-5 w-5 text-primary" />
                      <AlertDescription>
                        <p className="font-semibold mb-2">Restez informé du lancement</p>
                        <p className="text-sm">
                          Notre plateforme Legal Tech est en phase finale de développement. 
                          Nous mettons tout en œuvre pour vous offrir une expérience exceptionnelle 
                          alliant technologie et expertise juridique.
                        </p>
                      </AlertDescription>
                    </Alert>

                    {/* Call-to-actions */}
                    <div className="text-center space-y-4 pt-4">
                      <p className="text-muted-foreground mb-4">
                        En attendant, notre équipe d'avocats reste à votre entière disposition
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="shadow-lg" asChild>
                          <Link to="/consultation">
                            <Phone className="mr-2 h-5 w-5" />
                            Prendre rendez-vous
                          </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="shadow-lg" asChild>
                          <Link to="/contact">
                            <Mail className="mr-2 h-5 w-5" />
                            Nous contacter
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Message de confiance */}
              <div className="mt-12 text-center">
                <p className="text-lg text-muted-foreground italic">
                  "L'innovation au service de la justice, l'expertise au service de vos droits"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  — L'équipe AXE LEGAL
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENU EXISTANT MIS EN COMMENTAIRE - SERA RÉACTIVÉ LORS DU LANCEMENT */}
        {/* 
        {!showGuidance && (
          <section className="py-16 bg-gradient-to-b from-background to-primary/5" id="simulation">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
                <Badge className="mb-4" variant="outline">
                  <Scale className="h-4 w-4 mr-2" />
                  Simulation Gratuite
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Quelle est la <span className="text-primary">Nature</span> de Votre Problème ?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Sélectionnez la catégorie qui correspond le mieux à votre situation pour obtenir 
                  un guide complet des démarches juridiques à entreprendre.
                </p>
              </div>

              {isLoading ? (
                <div className="max-w-6xl mx-auto">
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement des catégories juridiques...</p>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="max-w-6xl mx-auto">
                  <div className="text-center py-20">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Aucune catégorie disponible</h3>
                    <p className="text-muted-foreground">
                      Les catégories juridiques seront bientôt disponibles.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="max-w-6xl mx-auto">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      
                      return (
                        <Card
                          key={category.id}
                          className={`p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 ${category.borderColor} group bg-gradient-to-br ${category.color} hover:scale-[1.02]`}
                          onClick={() => handleCategorySelect(category)}
                        >
                          <div className="space-y-4">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                              <IconComponent className="h-7 w-7 text-primary" />
                            </div>

                            <div>
                              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                                {category.title}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {category.description}
                              </p>
                            </div>

                            <div className="flex items-center text-sm text-primary font-medium group-hover:translate-x-2 transition-transform">
                              Voir les démarches
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="max-w-4xl mx-auto mt-12">
                <Alert className="border-primary/50 bg-primary/5">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <AlertDescription>
                    <p className="font-semibold mb-2">Votre situation n'est pas listée ?</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Chaque cas juridique est unique. Si votre problème ne figure pas dans les catégories ci-dessus, 
                      nous vous invitons à contacter directement notre cabinet pour une consultation personnalisée.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" asChild>
                        <Link to="/consultation">
                          <Phone className="h-4 w-4 mr-2" />
                          Demander une consultation
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/contact">
                          <Mail className="h-4 w-4 mr-2" />
                          Nous contacter
                        </Link>
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </section>
        )}

        {showGuidance && selectedCategory && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="mb-8"
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Choisir une autre catégorie
                </Button>

                <div className="mb-12">
                  <h2 className="text-4xl font-bold mb-6">{selectedCategory.guidanceTitle}</h2>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200">
                      <div className="text-sm text-muted-foreground mb-1">Délai estimé</div>
                      <div className="font-semibold">{selectedCategory.timeline}</div>
                    </Card>
                    <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200">
                      <div className="text-sm text-muted-foreground mb-1">Coût indicatif</div>
                      <div className="font-semibold">{selectedCategory.cost}</div>
                    </Card>
                    <Card className="p-4 bg-purple-50 dark:bg-purple-950 border-purple-200">
                      <div className="text-sm text-muted-foreground mb-1">Documents requis</div>
                      <div className="font-semibold">{selectedCategory.documents?.length || 0} pièces</div>
                    </Card>
                  </div>

                  {selectedCategory.warning && (
                    <Alert className="border-orange-500/50 bg-orange-50 dark:bg-orange-950">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      <AlertDescription className="text-orange-900 dark:text-orange-100">
                        <strong>Point d'attention :</strong> {selectedCategory.warning}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {selectedCategory.steps && selectedCategory.steps.length > 0 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Scale className="h-6 w-6 text-primary" />
                        Les Étapes de la Procédure
                      </CardTitle>
                      <CardDescription>
                        Suivez ce processus étape par étape pour résoudre votre situation juridique
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {selectedCategory.steps.map((step, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary border-2 border-primary/20">
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1 pb-6 border-b last:border-0">
                              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                              <p className="text-muted-foreground">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedCategory.documents && selectedCategory.documents.length > 0 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        Documents à Préparer
                      </CardTitle>
                      <CardDescription>
                        Liste complète des pièces justificatives nécessaires
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {selectedCategory.documents.map((doc, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-6 w-6 text-primary" />
                      Nos Recommandations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <p className="text-sm">
                        <strong>Ne tardez pas :</strong> Plus vous agissez rapidement, plus vos chances de succès sont élevées. 
                        Certaines actions juridiques sont soumises à des délais stricts.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <p className="text-sm">
                        <strong>Consultez un professionnel :</strong> Cette simulation est informative. Chaque situation est unique 
                        et mérite une analyse personnalisée par un avocat spécialisé.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <p className="text-sm">
                        <strong>Préparez votre dossier :</strong> Rassemblez tous les documents avant votre première consultation 
                        pour gagner du temps et faciliter le travail de votre avocat.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-12 p-8 bg-gradient-to-br from-primary via-primary/95 to-primary/90 rounded-xl text-white">
                  <div className="text-center space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold">
                      Besoin d'un Accompagnement Personnalisé ?
                    </h3>
                    <p className="text-white/90 max-w-2xl mx-auto">
                      Notre équipe d'avocats spécialisés est à votre disposition pour vous accompagner 
                      dans toutes vos démarches juridiques. Prenez rendez-vous dès maintenant pour une 
                      consultation adaptée à votre situation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                        <Link to="/consultation">
                          <Phone className="mr-2 h-5 w-5" />
                          Prendre rendez-vous
                        </Link>
                      </Button>
                      <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-primary transition-all" asChild>
                        <Link to="/contact">
                          <Mail className="mr-2 h-5 w-5" />
                          Nous contacter
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {!showGuidance && !isLoading && categories.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Une Assistance Juridique Complète
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Notre simulateur vous offre un aperçu des démarches juridiques nécessaires. 
                  Pour un accompagnement complet et personnalisé, notre équipe d'avocats est à votre disposition.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/consultation">
                      <Phone className="mr-2 h-5 w-5" />
                      Prendre rendez-vous
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/contact">
                      <Mail className="mr-2 h-5 w-5" />
                      Nous contacter
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
        */}
      </main>
      <Footer />
    </div>
  );
};

export default LegalTech;
