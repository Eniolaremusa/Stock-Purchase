import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface PortfolioCardProps extends HTMLAttributes<HTMLDivElement> {
  symbol?: string;
  shares?: number;
  value?: number;
}

export function PortfolioCard({
  symbol,
  shares,
  value,
  className,
  ...props
}: PortfolioCardProps) {
  return (
    <div data-component="portfolio-card" className={cn(className)} {...props}>
      {symbol && <span>{symbol}</span>}
      {shares !== undefined && <span>{shares}</span>}
      {value !== undefined && <span>{value}</span>}
    </div>
  );
}
