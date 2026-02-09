import { Card } from "@/components/ui/card";
import { Trophy, Zap, Clock, Users } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section className="about py-16 bg-white">
      <div className="about-container container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
        <div className="about-content animate-slide-in-left space-y-6">
          <div className="section-badge inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full">
            <i className="fas fa-book" /> Notre Histoire
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">Excellence et Innovation Juridique</h2>
          <p>
            Fondé en 2020, Axe Legal s'est imposé comme l'un des cabinets de conseil juridique les plus respectés
            du Bénin. Notre mission est de fournir des solutions juridiques innovantes et sur mesure
            à nos clients, qu'ils soient entrepreneurs, entreprises ou particuliers.
          </p>
          <p>
            Nous combinons une expertise technique pointue avec une approche humaine et personnalisée,
            garantissant à nos clients un accompagnement de qualité à chaque étape de leur parcours juridique.
          </p>

          <div className="about-features grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 text-white">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Approche stratégique</h4>
                  <p className="text-sm text-muted-foreground mt-1">Conseils sur-mesure et plans d'action concrets pour protéger et faire croître vos intérêts.</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-amber-400 to-amber-300 text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Réactivité</h4>
                  <p className="text-sm text-muted-foreground mt-1">Interventions rapides, priorisation des urgences et respect strict des délais procéduraux.</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Accompagnement</h4>
                  <p className="text-sm text-muted-foreground mt-1">Un suivi dédié, explications claires et une relation de confiance au fil du dossier.</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-600 text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Excellence</h4>
                  <p className="text-sm text-muted-foreground mt-1">Pratiques rigoureuses et expertise reconnue pour des résultats durables et mesurables.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="about-visual animate-slide-in-right">
          <div className="about-image relative rounded-3xl overflow-hidden shadow-lg h-72 md:h-96 lg:h-[560px]">
            <img
              src="/assets/images/about-photo.jpeg"
              alt="Cabinet Axe Legal - Équipe professionnelle"
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />

            {/* subtle gradient overlay to improve caption contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* small badge top-left */}
            <div className="absolute top-4 left-4 bg-white/90 text-sm text-slate-900 px-3 py-1 rounded-full shadow">5+ ans d'expérience</div>

            {/* caption bottom-left */}
            <div className="absolute left-4 bottom-4 bg-black/60 text-white px-3 py-2 rounded-md">
              <h3 className="text-sm font-semibold">Excellence Juridique</h3>
              <p className="text-xs text-white/90">Au service de nos clients</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
