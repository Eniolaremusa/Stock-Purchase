"use client";

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { EASING } from "@/lib/animation";
import { cn } from "@/lib/utils";

const EASE_OUT = EASING.easeOut;
const ICON_GAP_PX = 56;
const CONNECTED_OVERLAP_PX = 1;
const STOCK_CONTACT_X = -(ICON_GAP_PX + CONNECTED_OVERLAP_PX);
const CENTER_CORRECTION_X = -STOCK_CONTACT_X / 2;
const IMPACT_SHIFT_X = -5;
const SETTLED_PAUSE_MS = 250;
const CONFIRMATION_DURATION_S = 0.11;
const FADE_OUT_DURATION_S = 0.275;

const LOADING_MESSAGES = [
  "Purchasing shares...",
  "Registering ownership...",
  "Purchase complete",
] as const;

const APPROACH_LINEAR_DURATION_S = 0.47;
const APPROACH_DECEL_DURATION_S = 0.05;

const GROUP_MOMENTUM_TRANSITION = {
  duration: 0.78,
  times: [0, 0.12, 1] as number[],
  ease: EASE_OUT,
};

export interface LoadingAnimationProps {
  className?: string;
  stockLogoSrc?: string;
  stockLogoClassName?: string;
  onTransitionStart?: () => void;
  onComplete: () => void;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function LoadingAnimation({
  className,
  stockLogoSrc = "/assets/lilly-logo.png",
  stockLogoClassName,
  onTransitionStart,
  onComplete,
}: LoadingAnimationProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const screenControls = useAnimation();
  const iconsGroupControls = useAnimation();
  const stockControls = useAnimation();
  const textControls = useAnimation();
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function crossfadeMessage(nextIndex: number) {
      await textControls.start({
        opacity: 0,
        transition: { duration: 0.14, ease: EASE_OUT },
      });
      if (cancelled) return;
      setMessageIndex(nextIndex);
      await textControls.start({
        opacity: 1,
        transition: { duration: 0.14, ease: EASE_OUT },
      });
    }

    async function runSequence() {
      await screenControls.start({
        opacity: 1,
        transition: { duration: 0.2, ease: EASE_OUT },
      });
      if (cancelled) return;

      await textControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.22, ease: EASE_OUT },
      });
      if (cancelled) return;

      // Approach — 80% at steady speed, final 20% decelerates over ~50ms
      await stockControls.start({
        x: STOCK_CONTACT_X * 0.8,
        transition: { duration: APPROACH_LINEAR_DURATION_S, ease: "linear" },
      });
      if (cancelled) return;

      await stockControls.start({
        x: STOCK_CONTACT_X,
        transition: { duration: APPROACH_DECEL_DURATION_S, ease: EASE_OUT },
      });
      if (cancelled) return;

      // Contact — re-centre the attached pair (~1px overlap)
      await iconsGroupControls.start({
        x: CENTER_CORRECTION_X,
        transition: { duration: 0.09, ease: EASE_OUT },
      });
      if (cancelled) return;

      await crossfadeMessage(1);

      // Shared momentum — nudge left, glide back to centred rest
      const settledX = CENTER_CORRECTION_X;
      const impactX = CENTER_CORRECTION_X + IMPACT_SHIFT_X;
      await iconsGroupControls.start({
        x: [settledX, impactX, settledX],
        transition: GROUP_MOMENTUM_TRANSITION,
      });
      if (cancelled) return;

      await wait(SETTLED_PAUSE_MS);
      if (cancelled) return;

      await crossfadeMessage(2);

      // Confirmation pulse — subtle scale only, preserve centred x
      await iconsGroupControls.start({
        x: settledX,
        scale: [1, 1.02, 1],
        transition: {
          duration: CONFIRMATION_DURATION_S,
          times: [0, 0.45, 1],
          ease: EASE_OUT,
        },
      });
      if (cancelled) return;

      onTransitionStart?.();

      await screenControls.start({
        opacity: 0,
        transition: { duration: FADE_OUT_DURATION_S, ease: EASE_OUT },
      });
      if (cancelled || hasCompletedRef.current) return;

      hasCompletedRef.current = true;
      onComplete();
    }

    void runSequence();

    return () => {
      cancelled = true;
    };
  }, [
    iconsGroupControls,
    onComplete,
    onTransitionStart,
    screenControls,
    stockControls,
    textControls,
  ]);

  return (
    <motion.div
      data-component="loading-animation"
      className={cn("flex flex-col items-center", className)}
      initial={{ opacity: 0, y: 0 }}
      animate={screenControls}
    >
      <motion.div
        className="flex items-center"
        style={{ gap: ICON_GAP_PX }}
        initial={{ x: 0, scale: 1 }}
        animate={iconsGroupControls}
      >
        <div className="relative flex size-[40px] shrink-0 items-center justify-center overflow-hidden rounded-[142.857px] bg-wallet-icon">
          <span className="font-inter text-[21.429px] font-medium leading-none tracking-[-0.2143px] text-white">
            $
          </span>
        </div>

        <motion.div
          className={cn(
            "relative size-[40px] shrink-0 overflow-hidden rounded-[142.857px] bg-[#687387]",
            stockLogoClassName
          )}
          initial={{ x: 0 }}
          animate={stockControls}
        >
          <Image
            src={stockLogoSrc}
            alt=""
            width={43}
            height={43}
            className="pointer-events-none absolute left-1/2 top-1/2 size-[42.857px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </motion.div>
      </motion.div>

      <motion.p
        className="font-inter mt-[12px] shrink-0 whitespace-nowrap text-[15px] font-normal leading-normal tracking-[-0.3px] text-text-secondary"
        initial={{ opacity: 0, y: 8 }}
        animate={textControls}
      >
        {LOADING_MESSAGES[messageIndex]}
      </motion.p>
    </motion.div>
  );
}
