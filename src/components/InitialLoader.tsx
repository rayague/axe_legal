import { useEffect, useState } from "react";

export default function InitialLoader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simuler le chargement des ressources
    const loadingSteps = [
      { delay: 0, progress: 0 },
      { delay: 200, progress: 20 },
      { delay: 400, progress: 40 },
      { delay: 600, progress: 60 },
      { delay: 800, progress: 80 },
      { delay: 1000, progress: 100 },
    ];

    loadingSteps.forEach(({ delay, progress: targetProgress }) => {
      setTimeout(() => {
        setProgress(targetProgress);
      }, delay);
    });

    // Marquer comme chargé après l'animation
    const loadedTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => {
      clearTimeout(loadedTimer);
    };
  }, []);

  // Ne pas rendre si déjà chargé
  if (isLoaded) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 transition-opacity duration-700 ${
        progress >= 100 ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ pointerEvents: progress >= 100 ? 'none' : 'auto' }}
    >
      {/* Gradient bleu en arrière-plan */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, hsl(217 91% 40% / 0.15), transparent 50%),
            radial-gradient(circle at 70% 80%, hsl(217 91% 50% / 0.12), transparent 50%),
            radial-gradient(circle at 50% 50%, hsl(217 91% 40% / 0.08), transparent 70%)
          `
        }}
      />

      {/* Conteneur principal */}
      <div className="relative z-10 flex flex-col items-center space-y-8 animate-in fade-in duration-500">
        {/* Logo/Titre */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Axe Legal
          </h1>
          <p className="text-white/50 text-sm tracking-widest uppercase">
            Chargement en cours
          </p>
        </div>

        {/* Barre de progression */}
        <div className="w-80 space-y-3">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm shadow-lg">
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-light to-primary rounded-full relative transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
              }}
            >
              {/* Effet de brillance qui se déplace */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{
                  animation: 'shimmer 1.5s ease-in-out infinite'
                }}
              />
            </div>
          </div>
          
          {/* Pourcentage */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/40">Préparation...</span>
            <span className="text-primary-light font-mono font-semibold">{progress}%</span>
          </div>
        </div>

        {/* Points de chargement animés */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Styles d'animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
