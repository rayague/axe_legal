import { ReactNode, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import RouteTransitionOverlay from "@/components/RouteTransitionOverlay";

type Props = {
  children: ReactNode;
  durationMs?: number;
};

export default function RouteTransitionManager({ children, durationMs = 3000 }: Props) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"enter" | "exit">("enter");
  const timeoutRef = useRef<number | null>(null);
  const exitTimeoutRef = useRef<number | null>(null);
  const scrollStateRef = useRef<{ overflow: string; paddingRight: string } | null>(null);

  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (exitTimeoutRef.current) window.clearTimeout(exitTimeoutRef.current);

    const body = document.body;
    const prev = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    scrollStateRef.current = prev;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    setVisible(true);
    setPhase("enter");

    const fadeOutMs = 250;
    const safeDuration = Math.max(durationMs, fadeOutMs);
    const exitAt = Math.max(0, safeDuration - fadeOutMs);

    exitTimeoutRef.current = window.setTimeout(() => {
      setPhase("exit");
    }, exitAt);

    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);

      const saved = scrollStateRef.current;
      if (saved) {
        body.style.overflow = saved.overflow;
        body.style.paddingRight = saved.paddingRight;
        scrollStateRef.current = null;
      }
    }, safeDuration);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (exitTimeoutRef.current) window.clearTimeout(exitTimeoutRef.current);

      const saved = scrollStateRef.current;
      if (saved) {
        body.style.overflow = saved.overflow;
        body.style.paddingRight = saved.paddingRight;
        scrollStateRef.current = null;
      }
    };
  }, [location.key, durationMs]);

  return (
    <>
      {visible && <RouteTransitionOverlay durationMs={durationMs} phase={phase} />}
      {children}
    </>
  );
}
