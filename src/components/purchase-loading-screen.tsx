"use client";

import { LoadingAnimation } from "@/components/loading-animation";
import { formatAnimatedShares } from "@/lib/helpers";

export interface PurchaseLoadingScreenProps {
  shares: number;
  stockLogoSrc?: string;
  stockLogoClassName?: string;
  onTransitionStart?: () => void;
  onComplete: () => void;
}

export function PurchaseLoadingScreen({
  shares,
  stockLogoSrc,
  stockLogoClassName,
  onTransitionStart,
  onComplete,
}: PurchaseLoadingScreenProps) {
  return (
    <div className="relative min-h-screen w-full bg-page">
      <div className="absolute left-1/2 top-1/2 flex w-[400px] max-w-[400px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <LoadingAnimation
          stockLogoSrc={stockLogoSrc}
          stockLogoClassName={stockLogoClassName}
          onTransitionStart={onTransitionStart}
          onComplete={onComplete}
        />
        <span className="sr-only">
          Processing purchase of {formatAnimatedShares(shares)} shares
        </span>
      </div>
    </div>
  );
}
