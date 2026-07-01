"use client";

import Image from "next/image";

import type { Stock } from "@/lib/stocks";
import { formatCurrency } from "@/lib/helpers";
import { cn } from "@/lib/utils";

interface ExploreStockCardProps {
  stock: Stock;
  onClick?: (stock: Stock) => void;
}

export function ExploreStockCard({ stock, onClick }: ExploreStockCardProps) {
  const trendUp = stock.trendDisplay
    ? stock.trendDisplay === "up"
    : stock.priceChange >= 0;

  return (
    <button
      type="button"
      data-component="explore-stock-card"
      onClick={() => onClick?.(stock)}
      className={cn(
        "flex w-[288px] shrink-0 cursor-pointer flex-col gap-[8px] rounded-[16px] bg-surface p-[12px] text-left",
        "transition-shadow duration-150 ease-out",
        "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]",
        "hover:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button"
      )}
    >
      <div
        className={cn(
          "relative size-[28px] shrink-0 overflow-hidden rounded-[100px] bg-[#687387]",
          stock.logoClassName
        )}
      >
        <Image
          src={stock.logoSrc}
          alt=""
          fill
          className="pointer-events-none object-cover"
          sizes="28px"
        />
      </div>

      <div className="flex w-full items-center gap-[8px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <div className="flex w-full items-start gap-[4px] whitespace-nowrap text-[13px] leading-normal tracking-[-0.13px]">
            <p className="shrink-0 font-semibold text-text-primary">{stock.name}</p>
            <p className="shrink-0 font-normal text-text-secondary">{stock.symbol}</p>
          </div>
          <p className="shrink-0 whitespace-nowrap text-[13px] font-normal leading-normal tracking-[-0.13px] text-text-secondary">
            {formatCurrency(stock.price)}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start justify-center gap-[2px]">
          <p className="shrink-0 whitespace-nowrap text-[12px] font-normal leading-normal tracking-[-0.12px] text-text-secondary">
            {stock.priceChange >= 0 ? "+" : ""}
            {formatCurrency(stock.priceChange)}
          </p>
          <div className="flex items-center gap-[2px]">
            <Image
              src={trendUp ? "/assets/arrow-up.svg" : "/assets/arrow-down.svg"}
              alt=""
              width={8}
              height={8}
              className="size-[8px] shrink-0"
            />
            <p
              className={cn(
                "shrink-0 whitespace-nowrap text-[12px] font-normal leading-normal tracking-[-0.12px]",
                trendUp ? "text-positive" : "text-[#ec2d2d]"
              )}
            >
              {stock.priceChangePercent >= 0 ? "+" : ""}
              {stock.priceChangePercent}%
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
