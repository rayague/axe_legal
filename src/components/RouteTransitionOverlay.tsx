import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  durationMs: number;
  phase: "enter" | "exit";
};

export default function RouteTransitionOverlay({ durationMs, phase }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<any>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [progress, setProgress] = useState(0);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    setIsReducedMotion(reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    setProgress(0);
    const id = window.setTimeout(() => setProgress(100), 50);
    return () => window.clearTimeout(id);
  }, [durationMs]);

  useEffect(() => {
    if (isReducedMotion) return;

    let disposed = false;

    const init = async () => {
      const container = containerRef.current;
      if (!container) return;

      const THREE = await import("three");
      if (disposed) return;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x070a12, 3.6, 9.5);
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 7);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
      rendererRef.current = renderer;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x070a12, 1);

      container.appendChild(renderer.domElement);

      const spriteCanvas = document.createElement("canvas");
      spriteCanvas.width = 64;
      spriteCanvas.height = 64;
      const ctx = spriteCanvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.25, "rgba(255,239,200,0.95)");
        gradient.addColorStop(0.6, "rgba(212,175,55,0.35)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }

      const spriteTex = new THREE.CanvasTexture(spriteCanvas);
      spriteTex.minFilter = THREE.LinearFilter;
      spriteTex.magFilter = THREE.LinearFilter;

      const makeStarLayer = (opts: {
        count: number;
        radius: number;
        radiusJitter: number;
        size: number;
        opacity: number;
        whiteMixMax: number;
        twinkleSpeedMin: number;
        twinkleSpeedMax: number;
      }) => {
        const count = opts.count;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const theta = new Float32Array(count);
        const phi = new Float32Array(count);
        const baseRadius = new Float32Array(count);
        const twinklePhase = new Float32Array(count);
        const twinkleSpeed = new Float32Array(count);

        for (let i = 0; i < count; i++) {
          const t = Math.random() * Math.PI * 2;
          const u = Math.random() * 2 - 1;
          const p = Math.acos(u);
          const r = opts.radius + (Math.random() - 0.5) * opts.radiusJitter;

          theta[i] = t;
          phi[i] = p;
          baseRadius[i] = r;
          twinklePhase[i] = Math.random() * Math.PI * 2;
          twinkleSpeed[i] = opts.twinkleSpeedMin + Math.random() * (opts.twinkleSpeedMax - opts.twinkleSpeedMin);

          const mix = Math.random() * opts.whiteMixMax;
          const c = gold.clone().lerp(soft, mix);
          colors[i * 3 + 0] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;

          const sinP = Math.sin(p);
          positions[i * 3 + 0] = Math.cos(t) * sinP * r;
          positions[i * 3 + 1] = Math.cos(p) * r;
          positions[i * 3 + 2] = Math.sin(t) * sinP * r;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size: opts.size,
          map: spriteTex,
          vertexColors: true,
          transparent: true,
          opacity: opts.opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        return { count, geometry, material, points, colors, theta, phi, baseRadius, twinklePhase, twinkleSpeed };
      };

      const gold = new THREE.Color(0xd4af37);
      const soft = new THREE.Color(0xfff2cc);

      const core = makeStarLayer({
        count: 1600,
        radius: 1.75,
        radiusJitter: 0.28,
        size: 0.055,
        opacity: 0.92,
        whiteMixMax: 0.65,
        twinkleSpeedMin: 0.45,
        twinkleSpeedMax: 1.1,
      });

      const halo = makeStarLayer({
        count: 700,
        radius: 2.35,
        radiusJitter: 0.45,
        size: 0.035,
        opacity: 0.55,
        whiteMixMax: 0.95,
        twinkleSpeedMin: 0.25,
        twinkleSpeedMax: 0.7,
      });

      const ringGeom = new THREE.TorusGeometry(2.35, 0.02, 10, 280);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2.35;
      scene.add(ring);

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };

      resize();

      const onResize = () => resize();
      window.addEventListener("resize", onResize);

      const start = performance.now();

      const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
      const smoothstep = (e0: number, e1: number, x: number) => {
        const t = clamp01((x - e0) / (e1 - e0));
        return t * t * (3 - 2 * t);
      };

      const tick = (t: number) => {
        const elapsed = (t - start) / 1000;
        const p = clamp01((t - start) / Math.max(durationMs, 1));
        const fade = 1 - smoothstep(0.94, 1, p);
        const appear = smoothstep(0, 0.12, p);

        const updateLayer = (layer: typeof core, rotMul: number, wobbleMul: number) => {
          const posAttr = layer.geometry.getAttribute("position") as any;
          const colAttr = layer.geometry.getAttribute("color") as any;
          const arr: Float32Array = posAttr.array;
          const carr: Float32Array = colAttr.array;

          const rot = elapsed * rotMul;
          for (let i = 0; i < layer.count; i++) {
            const t0 = layer.theta[i] + rot * (0.35 + (i % 7) * 0.02);
            const p0 = layer.phi[i] + Math.sin(elapsed * 0.18 + i * 0.002) * 0.008 * wobbleMul;
            const r = layer.baseRadius[i];
            const sinP = Math.sin(p0);

            arr[i * 3 + 0] = Math.cos(t0) * sinP * r;
            arr[i * 3 + 1] = Math.cos(p0) * r;
            arr[i * 3 + 2] = Math.sin(t0) * sinP * r;

            const tw = 0.78 + 0.22 * Math.sin(layer.twinklePhase[i] + elapsed * layer.twinkleSpeed[i]);
            const k = tw * appear;
            carr[i * 3 + 0] = Math.min(1, layer.colors[i * 3 + 0] * (0.92 + 0.22 * k));
            carr[i * 3 + 1] = Math.min(1, layer.colors[i * 3 + 1] * (0.92 + 0.22 * k));
            carr[i * 3 + 2] = Math.min(1, layer.colors[i * 3 + 2] * (0.92 + 0.22 * k));
          }

          posAttr.needsUpdate = true;
          colAttr.needsUpdate = true;
        };

        updateLayer(core, 0.34, 1);
        updateLayer(halo, 0.22, 0.8);

        core.points.rotation.y = elapsed * 0.12;
        core.points.rotation.x = Math.sin(elapsed * 0.22) * 0.1;
        halo.points.rotation.y = -elapsed * 0.08;
        halo.points.rotation.x = Math.sin(elapsed * 0.18) * 0.06;
        ring.rotation.z = -elapsed * 0.22;
        ring.rotation.y = elapsed * 0.09;

        core.material.opacity = 0.92 * fade;
        halo.material.opacity = 0.55 * fade;
        ringMat.opacity = 0.12 * fade;

        camera.position.x = 0;
        camera.position.y = 0;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);

      return () => {
        window.removeEventListener("resize", onResize);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        core.geometry.dispose();
        core.material.dispose();
        halo.geometry.dispose();
        halo.material.dispose();
        spriteTex.dispose();
        ringGeom.dispose();
        ringMat.dispose();
        renderer.dispose();

        if (renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      };
    };

    let cleanup: (() => void) | undefined;

    init()
      .then((c) => {
        cleanup = c;
      })
      .catch((e) => {
        console.error("Three transition init error:", e);
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [isReducedMotion]);

  const fadeClass = phase === "enter" ? "animate-in fade-in duration-200" : "animate-out fade-out duration-250";

  return (
    <div className={`fixed inset-0 z-[9999] pointer-events-auto ${fadeClass}`} aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(212,175,55,0.18), transparent 55%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08), transparent 60%)" }} />

      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4 text-center shadow-2xl">
          <div className="text-sm tracking-[0.25em] uppercase text-white/70">Axe Legal</div>
          <div className="mt-1 text-lg font-semibold text-white">Chargement</div>
          <div className="mt-2 h-[2px] w-56 overflow-hidden rounded bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-yellow-200/80 via-yellow-400/70 to-yellow-200/80"
              style={{ width: `${progress}%`, transition: `width ${durationMs}ms linear` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
