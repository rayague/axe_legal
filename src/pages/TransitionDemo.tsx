import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroLegal from "@/assets/hero-legal.jpg";
import { useTranslation } from "react-i18next";

export default function TransitionDemo() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          eyebrow={t("pages.transition_demo.hero_eyebrow", { defaultValue: "Démo Animation" })}
          title={(
            <>
              {t("pages.transition_demo.hero_title_prefix", { defaultValue: "Transition" })}{" "}
              <span className="text-yellow-400">{t("pages.transition_demo.hero_title_highlight", { defaultValue: "Three.js" })}</span>
            </>
          )}
          subtitle={t("pages.transition_demo.hero_subtitle", { defaultValue: "Cette page sert de démonstration. Naviguez vers d'autres pages pour voir l'animation de transition (3 secondes) au chargement et lors des changements de route." })}
          ctaText={t("pages.transition_demo.hero_cta", { defaultValue: "Aller à l'accueil" })}
          ctaLink="/"
          imageSrc={heroLegal}
          large
        />

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid gap-6">
              <Card className="p-6 border-2">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold">{t("pages.transition_demo.test_title", { defaultValue: "Tester la transition" })}</h2>
                    <p className="text-muted-foreground">
                      {t("pages.transition_demo.test_subtitle", { defaultValue: "Cliquez sur ces liens pour déclencher la transition. Vous pouvez aussi utiliser la navigation du site." })}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild>
                      <Link to="/services">Services</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/equipe">Équipe</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/processus">Processus</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/annonces">Annonces</Link>
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="secondary">
                      <Link to="/contact">Contact</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/consultation">Consultation</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/legaltech">LegalTech</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/admin/login">Admin Login</Link>
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{t("pages.transition_demo.tip_title", { defaultValue: "Astuce" })}</h3>
                  <p className="text-muted-foreground">
                    {t("pages.transition_demo.tip_text", { defaultValue: "Pour simuler un rechargement complet, faites F5 sur n'importe quelle page: l'animation se relance." })}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
