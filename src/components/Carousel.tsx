import React, { useEffect, useRef, useState } from "react";

type Slide = {
  src?: string;
  alt?: string;
  caption?: string;
  // if provided, render this content inside the slide
  content?: React.ReactNode;
  // extra classes for card wrapper
  cardClass?: string;
};

type CarouselProps = {
  slides: Slide[];
  interval?: number; // ms
  className?: string;
};

const Carousel: React.FC<CarouselProps> = ({ slides, interval = 3500, className = "" }) => {
  const [index, setIndex] = useState(0);
  const [erroredMap, setErroredMap] = useState<Record<number, boolean>>({});
  const pausedRef = useRef(false);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval, slides.length, prefersReduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + slides.length) % slides.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % slides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
      tabIndex={0}
      aria-roledescription="carousel"
    >
      {slides.map((s, i) => (
        <div
          key={i}
          role={i === index ? 'group' : undefined}
          aria-roledescription={i === index ? 'active slide' : undefined}
          aria-hidden={i === index ? 'false' : 'true'}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {s.content ? (
            <div className={`w-full h-full flex items-center justify-center ${s.cardClass ?? ''}`}>
              {s.content}
            </div>
          ) : s.src ? (
            // show img; if it errors, render a subtle fallback so it's obvious
            erroredMap[i] ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-muted-foreground">Image indisponible</div>
            ) : (
              <img
                src={s.src}
                alt={s.alt ?? ''}
                className="w-full h-full object-cover"
                onError={() => setErroredMap((m) => ({ ...m, [i]: true }))}
              />
            )
          ) : null}

          {s.caption && (
            <div className="absolute left-4 bottom-4 bg-card/80 text-sm px-3 py-1 rounded-md shadow">{s.caption}</div>
          )}
        </div>
      ))}

      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-primary' : 'bg-white/60'}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="polite">
        {slides[index]?.caption ?? ''}
      </div>
    </div>
  );
};

export default Carousel;
