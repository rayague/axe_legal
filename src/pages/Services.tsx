import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServicesSection } from "@/components/ServicesSection";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail, Globe2 } from "lucide-react";
import servicesHero from "@/assets/business-law.jpg";

const Services = () => {
  return (
    <div className="min-h-screen">
  <Header />
  <main>
        <PageHero
          eyebrow="Nos Expertises"
          title={(
            <>
              Des <span className="text-yellow-400">Solutions</span> Juridiques<br />d'Excellence
            </>
          )}
          subtitle={"Une gamme complète de services juridiques adaptés aux besoins des entreprises et des particuliers, avec une approche personnalisée et des résultats garantis."}
          ctaText="Contactez-nous"
          ctaLink="/contact"
          imageSrc={servicesHero}
          large
        />

        <section className="py-24 bg-background" id="services">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <div className="w-full rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Globe2 className="h-5 w-5" />
                    <span>Service disponible en anglais</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    English available for consultations & legal support
                  </div>
                </div>
              </div>
            </div>
            <ServicesSection />
          </div>
        </section>

        {/* Section Résumé avec Call to Action */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Prêt à Bénéficier de Notre <span className="text-primary">Expertise Juridique</span> ?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Que vous soyez une entreprise en quête de sécurité juridique ou un particulier face à un défi légal, 
                  notre cabinet met à votre disposition son expertise reconnue et son approche personnalisée pour vous 
                  accompagner vers le succès.
                </p>
              </div>

              <div className="bg-card border-2 border-primary/20 rounded-2xl p-8 shadow-lg">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">6+</div>
                    <div className="text-sm text-muted-foreground">Domaines d'Expertise</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground">Approche Personnalisée</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Disponibilité & Réactivité</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="group" asChild>
                    <Link to="/contact">
                      Demander une Consultation
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="group" asChild>
                    <Link to="/contact">
                      <Phone className="mr-2 h-5 w-5" />
                      Nous Appeler
                    </Link>
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-primary/20">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    Réponse garantie sous 24h pour toute demande
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-card/50 backdrop-blur rounded-xl p-6 border border-primary/10">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    Pourquoi Nous Choisir ?
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Une équipe composée de professionnels expérimentés et spécialisés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Des solutions sur mesure adaptées à vos besoins</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Un accompagnement de A à Z dans vos démarches</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card/50 backdrop-blur rounded-xl p-6 border border-primary/10">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    Notre Engagement
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Transparence et communication régulière</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Excellence et rigueur dans chaque dossier</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Résultats concrets et mesurables</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
