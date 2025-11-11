import AnimatedCounter from "./AnimatedCounter";

export const StatsSection = () => {
  return (
    <section className="stats py-12 bg-gradient-to-b from-primary to-primary-dark text-white">
      <div className="container mx-auto px-4">
        <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white">
              <AnimatedCounter value={500} suffix="+" />
            </div>
            <div className="text-sm text-white/80">Clients Accompagnés</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white">
              <AnimatedCounter value={1000} suffix="+" />
            </div>
            <div className="text-sm text-white/80">Dossiers Traités</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white">
              <AnimatedCounter value={95} suffix="%" />
            </div>
            <div className="text-sm text-white/80">Taux de Réussite</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white">
              <AnimatedCounter value={5} suffix="+" />
            </div>
            <div className="text-sm text-white/80">Années d'Expérience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
