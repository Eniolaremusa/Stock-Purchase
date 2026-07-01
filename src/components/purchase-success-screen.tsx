"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import type { LegacyAnimationControls } from "framer-motion";

import { Certificate, type CertificateHandle } from "@/components/certificate";
import { MotionTuningPanel } from "@/components/dev/motion-tuning-panel";
import { PrimaryButton } from "@/components/primary-button";
import { SuccessMotionProvider, useSuccessMotion } from "@/contexts/success-motion-context";
import { useCertificateGenieEffect } from "@/hooks/use-certificate-genie-effect";
import { EASING } from "@/lib/animation";
import { formatCurrency, formatShares } from "@/lib/helpers";
import { cn } from "@/lib/utils";

const EASE_OUT = EASING.easeOut;
const SHOW_TUNING_PANEL = false;
const EXIT_DURATION_S = 0.25;
const EXIT_GAP_MS = 80;

export interface PurchaseSuccessScreenProps {
  shares: number;
  price: number;
  symbol?: string;
  companyName?: string;
  ownerName?: string;
  /** Mount during loading crossfade — screen fades in immediately */
  enterOnMount?: boolean;
  onDownloadComplete?: () => void;
}

function formatCertificateDate(date: Date): string {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  const month = date.toLocaleString("en-US", { month: "long" });
  return `${day}${suffix} ${month}, ${date.getFullYear()}`;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function SuccessTitle({
  formattedShares,
  formattedPrice,
  symbol,
  controls,
}: {
  formattedShares: string;
  formattedPrice: string;
  symbol: string;
  controls: LegacyAnimationControls;
}) {
  return (
    <motion.p
      className="font-inter w-[400px] shrink-0 text-pretty [word-break:break-word] text-[28px] font-medium leading-[normal] tracking-[-0.56px] text-[#5b5855]"
      initial={{ opacity: 0, y: 12 }}
      animate={controls}
    >
      <span className="font-semibold text-[#0a0a09]">Congratulations!</span>
      <span> You&apos;ve bought </span>
      <span className="font-semibold text-[#0a0a09]">{formattedShares} </span>
      <span>shares of </span>
      <span className="font-semibold text-[#0a0a09]">#{symbol}</span>
      <span> at </span>
      <span className="font-semibold text-[#0a0a09]">{formattedPrice} / share.</span>
    </motion.p>
  );
}

function PurchaseSuccessScreenContent({
  shares,
  price,
  symbol = "LLY",
  companyName,
  ownerName,
  enterOnMount = false,
  onDownloadComplete,
}: PurchaseSuccessScreenProps) {
  const { config } = useSuccessMotion();
  const screenControls = useAnimation();
  const headingControls = useAnimation();
  const certificateControls = useAnimation();
  const buttonControls = useAnimation();
  const buttonPulseControls = useAnimation();
  const certificateRef = useRef<CertificateHandle>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const downloadStartedRef = useRef(false);
  const [certificateInteractionLocked, setCertificateInteractionLocked] = useState(false);
  const [genieActive, setGenieActive] = useState(false);
  const [recipientName, setRecipientName] = useState(ownerName ?? "Eniola Remusa");

  const { play: playGenie, cancel: cancelGenie } = useCertificateGenieEffect();

  const formattedShares = formatShares(shares);
  const formattedPrice = formatCurrency(price);
  const purchaseDate = formatCertificateDate(new Date());

  useEffect(() => {
    let cancelled = false;

    async function runEntrance() {
      const revealDuration = config.general.motionEnabled
        ? config.general.revealDurationMs / 1000
        : 0;
      const stagger = config.general.motionEnabled
        ? config.general.staggerDelayMs
        : 0;

      await screenControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.28, ease: EASE_OUT },
      });
      if (cancelled) return;

      await headingControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.42, ease: EASE_OUT },
      });
      if (cancelled) return;

      await wait(stagger);
      if (cancelled) return;

      await certificateControls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: revealDuration || 0.01, ease: EASE_OUT },
      });
      if (cancelled) return;

      const stampPromise = certificateRef.current?.playStampStrike();

      await wait(300);
      if (cancelled) return;

      await buttonControls.start({
        opacity: 1,
        y: 0,
        transition: config.general.motionEnabled
          ? {
              type: "spring",
              visualDuration: 0.5,
              bounce: 0.2,
            }
          : { duration: 0.01 },
      });
      if (cancelled) return;

      await stampPromise;
    }

    void runEntrance();

    return () => {
      cancelled = true;
    };
  }, [
    buttonControls,
    certificateControls,
    config.general.motionEnabled,
    config.general.revealDurationMs,
    config.general.staggerDelayMs,
    headingControls,
    screenControls,
  ]);

  useEffect(() => () => cancelGenie(), [cancelGenie]);

  const handleDownload = useCallback(async () => {
    if (downloadStartedRef.current) return;
    downloadStartedRef.current = true;
    setCertificateInteractionLocked(true);

    const captureEl = certificateRef.current?.getCaptureElement();
    const buttonEl = buttonWrapperRef.current?.querySelector("button");

    let resolveContact!: () => void;
    const contactReached = new Promise<void>((resolve) => {
      resolveContact = resolve;
    });

    const runExitCascade = contactReached.then(async () => {
      await headingControls.start({
        opacity: 0,
        y: -10,
        transition: { duration: EXIT_DURATION_S, ease: EASE_OUT },
      });
      await wait(EXIT_GAP_MS);
      await buttonControls.start({
        opacity: 0,
        y: 8,
        transition: { duration: EXIT_DURATION_S, ease: EASE_OUT },
      });
    });

    if (!config.general.motionEnabled || !captureEl || !buttonEl) {
      if (captureEl) captureEl.style.opacity = "0";
      resolveContact();
      await runExitCascade;
    } else {
      setGenieActive(true);
      try {
        await Promise.all([
          playGenie(captureEl, buttonEl as HTMLButtonElement, {
            layerContainer: screenRef.current,
            onContact: resolveContact,
          }),
          runExitCascade,
        ]);
      } finally {
        setGenieActive(false);
      }
    }

    onDownloadComplete?.();
  }, [
    buttonControls,
    config.general.motionEnabled,
    headingControls,
    onDownloadComplete,
    playGenie,
  ]);

  return (
    <>
      <motion.div
        ref={screenRef}
        className="fixed inset-0 isolate min-h-screen w-full bg-page"
        initial={{ opacity: enterOnMount ? 0 : 1, y: enterOnMount ? 12 : 0 }}
        animate={screenControls}
      >
        <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[24px]">
          <SuccessTitle
            formattedShares={formattedShares}
            formattedPrice={formattedPrice}
            symbol={symbol}
            controls={headingControls}
          />

          <div className="relative z-10">
            <Certificate
              ref={certificateRef}
              shares={shares}
              price={price}
              purchaseDate={purchaseDate}
              companyName={companyName}
              ownerName={recipientName}
              onOwnerNameChange={setRecipientName}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={certificateControls}
              interactionDisabled={certificateInteractionLocked}
            />
          </div>

          <motion.div
            ref={buttonWrapperRef}
            className={cn(
              "relative w-[400px] shrink-0",
              genieActive ? "z-40" : "z-20"
            )}
            initial={{ opacity: 0, y: 8 }}
            animate={buttonControls}
          >
            <motion.div initial={{ scale: 1 }} animate={buttonPulseControls}>
              <PrimaryButton
                enabled
                className="max-w-none"
                onClick={handleDownload}
              >
                Download Certificate PDF
              </PrimaryButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      {SHOW_TUNING_PANEL ? <MotionTuningPanel /> : null}
    </>
  );
}

export function PurchaseSuccessScreen(props: PurchaseSuccessScreenProps) {
  return (
    <SuccessMotionProvider>
      <PurchaseSuccessScreenContent {...props} />
    </SuccessMotionProvider>
  );
}
