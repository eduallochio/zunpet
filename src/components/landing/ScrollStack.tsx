"use client";

import { useLayoutEffect, useRef, useCallback } from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

export const ScrollStackItem = ({
  children,
  itemClassName = "",
}: {
  children: React.ReactNode;
  itemClassName?: string;
}) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  onStackComplete?: () => void;
}

export default function ScrollStack({
  children,
  className = "",
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const getScrollData = useCallback(() => {
    const scroller = scrollerRef.current!;
    return { scrollTop: scroller.scrollTop, containerHeight: scroller.clientHeight };
  }, []);

  const getElementOffset = useCallback((element: HTMLElement) => {
    return element.offsetTop;
  }, []);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElement = scrollerRef.current?.querySelector(".scroll-stack-end") as HTMLElement | null;
    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const easedScale =
        scaleProgress < 0.5
          ? 2 * scaleProgress * scaleProgress
          : 1 - Math.pow(-2 * scaleProgress + 2, 2) / 2;

      const scale = 1 - (1 - baseScale) * easedScale + itemScale * i * easedScale;
      const pinProgress = calculateProgress(scrollTop, pinStart, pinEnd);
      const translateY = pinProgress > 0 ? itemStackDistance * i * pinProgress : 0;
      const rotation = rotationAmount ? (i % 2 === 0 ? rotationAmount : -rotationAmount) * easedScale : 0;
      const blur = blurAmount ? blurAmount * easedScale * i * 0.5 : 0;

      const newT = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const last = lastTransformsRef.current.get(card);
      const changed = !last || last.translateY !== newT.translateY || last.scale !== newT.scale || last.rotation !== newT.rotation || last.blur !== newT.blur;

      if (changed) {
        card.style.transform = `translate3d(0, ${newT.translateY}px, 0) scale(${newT.scale}) rotate(${newT.rotation}deg)`;
        card.style.filter = newT.blur > 0 ? `blur(${newT.blur}px)` : "";
        lastTransformsRef.current.set(card, newT);
      }
    });

    if (!stackCompletedRef.current && typeof onStackComplete === "function") {
      stackCompletedRef.current = true;
      onStackComplete();
    }

    isUpdatingRef.current = false;
  }, [getScrollData, parsePercentage, stackPosition, scaleEndPosition, getElementOffset, itemStackDistance, calculateProgress, baseScale, itemScale, rotationAmount, blurAmount, onStackComplete]);

  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(updateCardTransforms);
  }, [updateCardTransforms]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll(".scroll-stack-card")) as HTMLElement[];
    cardsRef.current = cards;
    lastTransformsRef.current = new Map();

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.querySelector(".scroll-stack-inner") as HTMLElement,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      lerp: 0.1,
    });

    lenis.on("scroll", handleScroll);
    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    updateCardTransforms();

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [handleScroll, updateCardTransforms]);

  return (
    <div
      className={`scroll-stack-scroller ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
}
