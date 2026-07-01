"use client";

import { motion } from "framer-motion";

import { ExploreStockCarousel } from "@/components/explore-stock-carousel";
import { PrimaryButton } from "@/components/primary-button";
import { SuccessMotionProvider, useSuccessMotion } from "@/contexts/success-motion-context";
import { EASING } from "@/lib/animation";
import type { Stock } from "@/lib/stocks";

export interface CertificateDownloadScreenProps {
  onSelectStock?: (stock: Stock) => void;
  onContinueHome?: () => void;
}

function CertificateDownloadScreenContent({
  onSelectStock,
  onContinueHome,
}: CertificateDownloadScreenProps) {
  const { config } = useSuccessMotion();
  const { explore } = config;

  return (
    <motion.div
      data-component="certificate-download-screen"
      className="fixed inset-0 min-h-screen w-full bg-page"
      initial={{ opacity: 0, y: explore.screenEnterTranslateY }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: explore.screenTransitionMs / 1000,
        ease: EASING.easeOut,
      }}
    >
      <div className="absolute left-1/2 top-1/2 flex w-[min(1224px,100vw-48px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[24px]">
        <div className="flex w-[400px] shrink-0 flex-col gap-[4px]">
          <h1 className="font-inter text-[28px] font-medium leading-normal tracking-[-0.56px]">
            <span className="font-semibold text-text-primary">Your certificate</span>
            <span className="text-text-secondary"> is in your mail!</span>
          </h1>
          <p className="font-inter text-[15px] font-normal leading-normal tracking-[-0.3px] text-text-secondary">
            Explore more stock options while you&apos;re here.
          </p>
        </div>

        <ExploreStockCarousel onSelectStock={onSelectStock} />

        <div className="w-[400px] shrink-0">
          <PrimaryButton enabled className="max-w-none" onClick={onContinueHome}>
            Continue to homepage
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  );
}

export function CertificateDownloadScreen(props: CertificateDownloadScreenProps) {
  return (
    <SuccessMotionProvider>
      <CertificateDownloadScreenContent {...props} />
    </SuccessMotionProvider>
  );
}
