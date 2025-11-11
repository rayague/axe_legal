import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import businessLaw from '@/assets/business-law.jpg';
import taxLaw from '@/assets/tax-law.jpg';
import realEstateLaw from '@/assets/real-estate-law.jpg';
import laborLaw from '@/assets/labor-law.jpg';

const SLIDES = [
  { src: businessLaw, alt: 'Droit des affaires', caption: "Cabinet - Droit des affaires" },
  { src: taxLaw, alt: 'Droit fiscal', caption: "Conseil - Droit fiscal" },
  { src: realEstateLaw, alt: 'Droit immobilier', caption: "Transactions - Droit immobilier" },
  { src: laborLaw, alt: 'Droit du travail', caption: "Contentieux - Droit du travail" },
];

const SimpleCarousel: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  // autoplay
  useEffect(() => {
    if (!emblaApi) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(() => {
      if (isPaused) return;
      emblaApi.scrollNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [emblaApi, isPaused]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  const prev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-2xl min-h-[320px] md:min-h-[480px] lg:min-h-[560px] ${className} z-30`}>
      {/* thin amber top border */}
      <div className="absolute -top-2 left-0 right-0 h-2 bg-amber-300 rounded-t-2xl shadow-sm" />

      <div
        className="embla overflow-hidden h-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <div className="embla__viewport h-full" ref={emblaRef}>
          <div className="embla__container flex h-full">
            {SLIDES.map((s, i) => (
              <div key={i} className="embla__slide flex-shrink-0 w-full h-full">
                <img src={s.src} alt={s.alt} loading="lazy" className="w-full h-full object-cover block" />
                {s.caption && (
                  <div className="absolute left-4 bottom-6 bg-black/50 text-white text-sm px-3 py-1 rounded-md">{s.caption}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* prev/next arrows */}
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 z-40 bg-white/90 p-2 rounded-full shadow hover:bg-white"
          aria-label="Précédent"
          onClick={prev}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 z-40 bg-white/90 p-2 rounded-full shadow hover:bg-white"
          aria-label="Suivant"
          onClick={next}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* dots */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-colors ${i === selectedIndex ? 'bg-primary' : 'bg-white/60'}`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
        <div className="sr-only" aria-live="polite">Slide {selectedIndex + 1} sur {SLIDES.length}</div>
      </div>
    </div>
  );
};

export default SimpleCarousel;
