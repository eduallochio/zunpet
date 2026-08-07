"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

interface CarouselItem {
  image: string;
  alt: string;
  label: string;
}

interface DepthCarouselProps {
  items: CarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: "left" | "right";
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  duration?: number;
  ease?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export default function DepthCarousel({
  items,
  cardWidth = 220,
  cardHeight = 420,
  radius = 24,
  tint = "#05060a",
  depth = 200,
  spread = 80,
  tilt = 18,
  tiltDirection = "right",
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.22,
  blur = 5,
  duration = 650,
  ease = "power3.out",
  autoplay = true,
  autoplayDelay = 3000,
  loop = true,
  showControls = true,
  showIndicators = true,
}: DepthCarouselProps) {
  const data = useMemo(() => items, [items]);
  const count = data.length;

  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const posRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scaleRef = useRef(1);
  const cfgRef = useRef({
    count, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur,
    duration, ease, loop, cardWidth, autoplayDelay,
  });

  const dragRef = useRef<{ x: number; startPos: number; lastX: number; lastT: number; v: number; moved: boolean; id: number } | null>(null);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedRef = useRef(false);

  const [active, setActive] = useState(0);

  cfgRef.current = { count, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, duration, ease, loop, cardWidth, autoplayDelay };

  const layout = useCallback((pos: number) => {
    const cfg = cfgRef.current;
    if (!cfg.count) return;
    const dir = cfg.tiltDirection === "left" ? -1 : 1;
    const sc = scaleRef.current;

    for (let i = 0; i < cfg.count; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let d = i - pos;
      if (cfg.loop && cfg.count > 1) {
        d = ((d % cfg.count) + cfg.count) % cfg.count;
        if (d > cfg.count / 2) d -= cfg.count;
      }

      const back = Math.max(0, d);
      const az = Math.abs(d);
      const shown = az <= cfg.visibleCards + 0.5;

      const tz = -cfg.depth * d;
      const tx = dir * cfg.spread * d;
      const ry = dir * cfg.tilt * clamp(d, 0, 1);

      let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.15, 1 - back * cfg.falloff);
      const blurPx = cfg.blur > 0 ? Math.min(cfg.blur, (back / Math.max(1, cfg.visibleCards)) * cfg.blur) : 0;
      const zi = Math.round(2000 - d * 20);

      el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
      el.style.zIndex = String(zi);
      el.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";

      const ov = overlayRefs.current[i];
      if (ov) ov.style.opacity = clamp(back * cfg.falloff * 1.25, 0, 0.86).toFixed(3);
    }
  }, []);

  const tweenTo = useCallback((target: number, animate: boolean) => {
    tweenRef.current?.kill();
    const cfg = cfgRef.current;
    const proxy = { p: posRef.current };
    const dur = animate && !reducedRef.current ? cfg.duration / 1000 : 0;
    tweenRef.current = gsap.to(proxy, {
      p: target,
      duration: dur,
      ease: cfg.ease,
      onUpdate: () => { posRef.current = proxy.p; layout(proxy.p); },
      onComplete: () => {
        const n = cfg.count;
        if (n > 0) posRef.current = ((posRef.current % n) + n) % n;
        layout(posRef.current);
      },
    });
  }, [layout]);

  const setFocus = useCallback((rawIndex: number, animate = true) => {
    const cfg = cfgRef.current;
    const n = cfg.count;
    if (!n) return;
    const idx = cfg.loop ? ((rawIndex % n) + n) % n : clamp(rawIndex, 0, n - 1);
    let delta = idx - posRef.current;
    if (cfg.loop && n > 1) {
      delta = ((delta % n) + n) % n;
      if (delta > n / 2) delta -= n;
    }
    tweenTo(posRef.current + delta, animate);
    if (idx !== focusRef.current) { focusRef.current = idx; setActive(idx); }
  }, [tweenTo]);

  const navigateBy = useCallback((step: number) => setFocus(focusRef.current + step, true), [setFocus]);

  // ResizeObserver para escala responsiva
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      const cfg = cfgRef.current;
      const needed = cfg.cardWidth + Math.abs(cfg.spread) * 2 + 120;
      scaleRef.current = clamp(w / needed, 0.35, 1);
      layout(posRef.current);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [layout]);

  // Wheel
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const cfg = cfgRef.current;
      if (cfg.count < 2) return;
      e.preventDefault();
      tweenRef.current?.kill();
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const delta = e.deltaMode === 1 ? raw * 24 : raw;
      const step = clamp(delta / (cfg.cardWidth * 0.9), -0.6, 0.6);
      posRef.current += step;
      layout(posRef.current);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => setFocus(Math.round(posRef.current), true), 130);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current); };
  }, [layout, setFocus]);

  // Drag
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (cfgRef.current.count < 2) return;
    tweenRef.current?.kill();
    dragRef.current = { x: e.clientX, startPos: posRef.current, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false, id: e.pointerId };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const cfg = cfgRef.current;
    const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 40);
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; rootRef.current?.setPointerCapture(drag.id); }
    if (!drag.moved) return;
    const now = performance.now();
    const dt = Math.max(now - drag.lastT, 1);
    drag.v = (e.clientX - drag.lastX) / dt;
    drag.lastX = e.clientX;
    drag.lastT = now;
    posRef.current = drag.startPos - dx / stepPx;
    layout(posRef.current);
  }, [layout]);

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (!drag.moved) return;
    const cfg = cfgRef.current;
    const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 40);
    const projected = posRef.current - (drag.v * 180) / stepPx;
    setFocus(Math.round(projected), true);
  }, [setFocus]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); navigateBy(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); navigateBy(1); }
  }, [navigateBy]);

  // Autoplay
  useEffect(() => {
    reducedRef.current = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!autoplay || reducedRef.current || count < 2) return;
    const root = rootRef.current;
    let hovered = false;
    const stop = () => { if (autoTimerRef.current) clearInterval(autoTimerRef.current); autoTimerRef.current = null; };
    const start = () => {
      stop();
      autoTimerRef.current = setInterval(() => { if (!hovered) navigateBy(1); }, Math.max(cfgRef.current.autoplayDelay, 600));
    };
    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    root?.addEventListener("mouseenter", onEnter);
    root?.addEventListener("mouseleave", onLeave);
    start();
    return () => { stop(); root?.removeEventListener("mouseenter", onEnter); root?.removeEventListener("mouseleave", onLeave); };
  }, [autoplay, autoplayDelay, count, navigateBy]);

  useEffect(() => { layout(posRef.current); }, [layout, depth, spread, tilt, visibleCards, falloff, blur, cardWidth, count]);

  useEffect(() => () => {
    tweenRef.current?.kill();
    if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex h-full min-h-[480px] w-full cursor-grab touch-pan-y select-none items-center justify-center outline-none active:cursor-grabbing"
      style={{ perspective: `${perspective}px`, perspectiveOrigin: "50% 50%" }}
      role="group"
      aria-roledescription="carousel"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {data.map((item, i) => (
          <div
            key={i}
            ref={el => { cardRefs.current[i] = el; }}
            className="absolute left-1/2 top-1/2 overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.65)]"
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius, willChange: "transform, opacity, filter", transformOrigin: "center" }}
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}`}
            aria-hidden={active !== i}
            onClick={() => { if (!dragRef.current?.moved) setFocus(i, true); }}
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              className="object-cover object-top pointer-events-none select-none"
              sizes={`${cardWidth}px`}
              draggable={false}
            />
            <span
              ref={el => { overlayRefs.current[i] = el; }}
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-multiply"
              style={{ background: tint }}
            />
            {/* Label no active */}
            {active === i && (
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                <p className="text-center text-xs font-medium text-white/80">{item.label}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showControls && count > 1 && (
        <>
          <button
            type="button"
            className="absolute left-2 top-1/2 z-[3000] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-black/60 active:scale-95"
            aria-label="Anterior"
            onClick={() => navigateBy(-1)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 z-[3000] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-black/60 active:scale-95"
            aria-label="Próximo"
            onClick={() => navigateBy(1)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {showIndicators && count > 1 && (
        <div
          className="absolute bottom-3 left-1/2 z-[3000] flex -translate-x-1/2 gap-1.5 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm"
          role="tablist"
        >
          {data.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Slide ${i + 1}`}
              className="h-[6px] cursor-pointer rounded-full transition-all duration-300"
              style={{
                width: active === i ? "20px" : "6px",
                background: active === i ? "oklch(0.72 0.14 174)" : "rgba(255,255,255,0.25)",
              }}
              onClick={() => setFocus(i, true)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
