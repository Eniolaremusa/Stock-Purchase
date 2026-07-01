"use client";

import { useCallback, useEffect, useRef } from "react";

import { ExploreStockCard } from "@/components/explore-stock-card";
import type { Stock } from "@/lib/stocks";
import { EXPLORE_STOCKS } from "@/lib/stocks";

const CARD_WIDTH = 288;
const GAP = 24;
const SEGMENT_WIDTH = CARD_WIDTH + GAP;
const BASE_SPEED = 0.45;
const HOVER_SPEED = 0.08;
const SPEED_LERP = 0.06;

interface ExploreStockCarouselProps {
  onSelectStock?: (stock: Stock) => void;
}

export function ExploreStockCarousel({ onSelectStock }: ExploreStockCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const speedRef = useRef(BASE_SPEED);
  const targetSpeedRef = useRef(BASE_SPEED);
  const rafRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);

  const loopWidth = SEGMENT_WIDTH * EXPLORE_STOCKS.length;
  const items = [...EXPLORE_STOCKS, ...EXPLORE_STOCKS];

  const tick = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    speedRef.current +=
      (targetSpeedRef.current - speedRef.current) * SPEED_LERP;

    offsetRef.current -= speedRef.current;

    if (offsetRef.current <= -loopWidth) {
      offsetRef.current += loopWidth;
    }

    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    rafRef.current = requestAnimationFrame(tick);
  }, [loopWidth]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [tick]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    targetSpeedRef.current = HOVER_SPEED;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    targetSpeedRef.current = BASE_SPEED;
  };

  return (
    <div
      data-component="explore-stock-carousel"
      className="relative w-full max-w-[800px] overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="flex w-max items-center gap-[24px] will-change-transform"
      >
        {items.map((stock, index) => (
          <ExploreStockCard
            key={`${stock.symbol}-${index}`}
            stock={stock}
            onClick={onSelectStock}
          />
        ))}
      </div>
    </div>
  );
}
