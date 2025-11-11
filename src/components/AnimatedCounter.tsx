import React, { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  duration?: number; // ms
  suffix?: string;
  decimals?: number;
  className?: string;
};

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1200,
  suffix = "",
  decimals = 0,
  className = "",
}) => {
  const [display, setDisplay] = useState<string>("0");
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            start();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    io.observe(node);

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const start = () => {
    const startTime = performance.now();
    const from = 0;
    const to = value;

    const step = (time: number) => {
      const t = Math.min(1, (time - startTime) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      setDisplay(formatNumber(current, decimals));
      if (t < 1) requestAnimationFrame(step);
      else setDisplay(formatNumber(to, decimals));
    };

    requestAnimationFrame(step);
  };

  const formatNumber = (n: number, decs = 0) => {
    if (decs > 0) return n.toFixed(decs) + suffix;
    // round to integer
    const v = Math.round(n);
    return v.toLocaleString() + suffix;
  };

  return (
    <div ref={ref} className={className} aria-hidden>
      {display}
    </div>
  );
};

export default AnimatedCounter;
