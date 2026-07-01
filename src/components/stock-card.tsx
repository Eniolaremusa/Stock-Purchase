"use client";

import NumberFlow from "@number-flow/react";
import Image from "next/image";

import type { HTMLAttributes } from "react";

import {
  NUMBER_FLOW_TIMING,
  SHARES_NUMBER_FORMAT,
} from "@/lib/number-flow-config";
import { formatCurrency } from "@/lib/helpers";
import { cn } from "@/lib/utils";

export interface StockCardProps extends HTMLAttributes<HTMLDivElement> {
  name?: string;
  symbol?: string;
  price?: number;
  priceChange?: number;
  priceChangePercent?: number;
  logoSrc?: string;
  logoClassName?: string;
  amount?: number;
}

export function StockCard({
  name = "Eli Lily and Company",
  symbol = "LLY",
  price = 1225.85,
  priceChange = 23.26,
  priceChangePercent = 1.92,
  logoSrc = "/assets/lilly-logo.png",
  logoClassName,
  amount = 0,
  className,
  ...props
}: StockCardProps) {
  const estimatedShares = price > 0 ? amount / price : 0;
  const hasAmount = amount > 0;

  return (
    <div
      data-component="stock-card"
      className={cn("flex w-full flex-col gap-[2px]", className)}
      {...props}
    >
      <div className="bg-surface flex w-full shrink-0 items-center gap-[8px] overflow-hidden rounded-tl-[16px] rounded-tr-[16px] p-[12px]">
        <div
          className={cn(
            "relative size-[28px] shrink-0 overflow-hidden rounded-[100px] bg-[#687387]",
            logoClassName
          )}
        >
          <Image
            src={logoSrc}
            alt=""
            width={30}
            height={30}
            className="pointer-events-none absolute left-1/2 top-1/2 size-[30px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>
        <div className="flex min-w-px flex-1 flex-col gap-[2px]">
          <div className="flex w-full shrink-0 items-start gap-[4px] whitespace-nowrap text-[13px] leading-normal tracking-[-0.13px]">
            <p className="shrink-0 font-semibold text-text-primary">{name}</p>
            <p className="shrink-0 font-normal text-text-secondary">{symbol}</p>
          </div>
          <p className="shrink-0 text-[13px] font-normal leading-normal tracking-[-0.13px] text-text-secondary">
            {formatCurrency(price)}{" "}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start justify-center gap-[2px]">
          <p className="shrink-0 whitespace-nowrap text-[12px] font-normal leading-normal tracking-[-0.12px] text-text-secondary">
            +{formatCurrency(priceChange)}
          </p>
          <div className="flex shrink-0 items-center gap-[2px]">
            <Image
              src="/assets/arrow-up.svg"
              alt=""
              width={8}
              height={8}
              className="size-[8px] shrink-0"
            />
            <p className="shrink-0 whitespace-nowrap text-[12px] font-normal leading-normal tracking-[-0.12px] text-positive">
              {priceChangePercent}%
            </p>
          </div>
        </div>
      </div>
      <div className="bg-surface flex w-full items-center gap-[12px] overflow-hidden rounded-bl-[16px] rounded-br-[16px] px-[12px] py-[20px]">
        <p
          className={cn(
            "min-w-px flex-1 text-[24px] font-semibold leading-normal tracking-[-0.24px] [font-variant-numeric:tabular-nums]",
            hasAmount ? "text-text-primary" : "text-text-placeholder"
          )}
        >
          {hasAmount ? (
            <NumberFlow
              value={estimatedShares}
              format={SHARES_NUMBER_FORMAT}
              locales="en-US"
              {...NUMBER_FLOW_TIMING}
            />
          ) : (
            "$0.00"
          )}
        </p>
        <p className="shrink-0 whitespace-nowrap text-[13px] font-normal leading-normal tracking-[-0.13px] text-text-secondary">
          number of shares
        </p>
      </div>
    </div>
  );
}
