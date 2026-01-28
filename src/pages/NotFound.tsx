import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Home, MessageSquare, SearchX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4">
                <SearchX className="h-4 w-4 mr-2" />
                Page introuvable
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold">
                Erreur <span className="text-primary">404</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                La page que vous cherchez n'existe pas ou a été déplacée.
              </p>
              <p className="mt-2 text-sm text-muted-foreground break-all">
                Chemin demandé : <span className="font-medium">{location.pathname}</span>
              </p>
            </div>

            <Card className="p-6 md:p-8 border-2 shadow-lg">
              <div className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/">
                      <Home className="h-4 w-4" />
                      Retour à l'accueil
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link to="/contact">
                      <MessageSquare className="h-4 w-4" />
                      Nous contacter
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                  <div className="text-sm font-semibold">Suggestions</div>
                  <div className="mt-2 grid gap-2 text-sm text-muted-foreground">
                    <Link to="/services" className="hover:text-primary transition-colors">Voir nos services</Link>
                    <Link to="/equipe" className="hover:text-primary transition-colors">Découvrir l'équipe</Link>
                    <Link to="/annonces" className="hover:text-primary transition-colors">Consulter les annonces</Link>
                    <Link to="/demo/transition" className="hover:text-primary transition-colors">Démo animation</Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
