import React, { useEffect, useState, useRef } from "react";

type TypedTextProps = {
  text: string;
  speed?: number; // ms per character when typing
  deleteSpeed?: number; // ms per character when deleting
  pause?: number; // ms pause at end/beginning
  className?: string;
  cursor?: boolean;
  loop?: boolean;
};

export const TypedText: React.FC<TypedTextProps> = ({
  text,
  speed = 80,
  deleteSpeed = 40,
  pause = 900,
  className = "",
  cursor = true,
  loop = true,
}) => {
  const [display, setDisplay] = useState("");
  const phaseRef = useRef<'typing' | 'pausing' | 'deleting'>('typing');
  const idxRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const clear = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const step = () => {
      if (!mounted) return;
      const phase = phaseRef.current;
      const i = idxRef.current;

      if (phase === 'typing') {
        if (i <= text.length) {
          setDisplay(text.slice(0, i));
          idxRef.current = i + 1;
          timeoutRef.current = window.setTimeout(step, speed);
        } else {
          // finished typing
          phaseRef.current = 'pausing';
          timeoutRef.current = window.setTimeout(() => {
            if (!loop) return; // stop if not looping
            phaseRef.current = 'deleting';
            idxRef.current = text.length - 1;
            step();
          }, pause);
        }
      } else if (phase === 'deleting') {
        if (i >= 0) {
          setDisplay(text.slice(0, i));
          idxRef.current = i - 1;
          timeoutRef.current = window.setTimeout(step, deleteSpeed);
        } else {
          // finished deleting
          phaseRef.current = 'pausing';
          timeoutRef.current = window.setTimeout(() => {
            phaseRef.current = 'typing';
            idxRef.current = 0;
            step();
          }, pause);
        }
      }
    };

    // start
    phaseRef.current = 'typing';
    idxRef.current = 0;
    timeoutRef.current = window.setTimeout(step, speed);

    return () => {
      mounted = false;
      clear();
    };
    // dependencies intentionally minimal: text controls rest
  }, [text, speed, deleteSpeed, pause, loop]);

  return (
    <span className={className} aria-live="polite">
      {display}
      {cursor && <span className="inline-block w-[1ch] animate-blink">|</span>}
    </span>
  );
};

export default TypedText;
