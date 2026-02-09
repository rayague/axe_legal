import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Star, 
  Award, 
  TrendingUp, 
  Users, 
  CheckCircle,
  ArrowRight,
  Quote,
  ThumbsUp
} from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import heroLegal from "@/assets/hero-legal.jpg";

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <PageHero
          eyebrow="Témoignages Clients"
          title={(
            <>
              La Confiance de Nos <span className="text-yellow-400">Clients</span>,<br />
            </>
          )}
          subtitle={"Découvrez les témoignages authentiques de nos clients satisfaits. Leur réussite est notre fierté et témoigne de notre engagement envers l'excellence juridique."}
          ctaText="Rejoignez-les"
          ctaLink="/contact"
          imageSrc={heroLegal}
          large
        />

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4" variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  Notre Impact
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Des Chiffres qui <span className="text-primary">Parlent d'Eux-Mêmes</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  La satisfaction de nos clients se mesure aussi en chiffres
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <Star className="h-7 w-7 text-primary fill-primary" />
                  </div>
                  <div className="text-4xl font-extrabold text-primary mb-2">
                    <AnimatedCounter value={4.9} decimals={1} suffix="/5" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Note Moyenne</div>
                </Card>

                <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-4xl font-extrabold text-primary mb-2">
                    <AnimatedCounter value={150} suffix="+" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Clients Satisfaits</div>
                </Card>

                <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <ThumbsUp className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-4xl font-extrabold text-primary mb-2">
                    <AnimatedCounter value={95} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Recommandations</div>
                </Card>

                <Card className="p-6 text-center border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-4xl font-extrabold text-primary mb-2">
                    <AnimatedCounter value={95} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Taux de Réussite</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <TestimonialsSection />

        {/* Trust Indicators */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Pourquoi Nos Clients Nous Font <span className="text-primary">Confiance</span>
                </h2>
                <p className="text-muted-foreground">
                  Les raisons qui font de nous le partenaire juridique de choix
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Expertise Reconnue</h3>
                      <p className="text-muted-foreground text-sm">
                        Une équipe de juristes hautement qualifiés avec une expertise pointue dans chaque domaine du droit
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Approche Personnalisée</h3>
                      <p className="text-muted-foreground text-sm">
                        Chaque dossier est unique et mérite une attention particulière et des solutions sur mesure
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Transparence Totale</h3>
                      <p className="text-muted-foreground text-sm">
                        Communication claire, honoraires transparents et points réguliers sur l'avancement de votre dossier
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Résultats Concrets</h3>
                      <p className="text-muted-foreground text-sm">
                        Notre focus est mis sur l'atteinte de vos objectifs avec des stratégies éprouvées et efficaces
                      </p>
                    </div>
                  </div>
                </Card>
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
                  <Quote className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold">
                  Rejoignez Nos <span className="text-primary">Clients Satisfaits</span>
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Faites l'expérience d'un service juridique d'excellence. Contactez-nous dès aujourd'hui 
                  pour une première consultation gratuite et découvrez comment nous pouvons vous aider.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="group" asChild>
                    <Link to="/contact">
                      Demander une Consultation
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
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Consultation gratuite</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Sans engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Réponse sous 24h</span>
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
