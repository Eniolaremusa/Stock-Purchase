"use client";

import { useEffect, useState } from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  type Transition,
} from "framer-motion";

import { COUNTER_TRANSITION } from "@/lib/animation";
import { generateDollarSteps } from "@/lib/helpers";

/**
 * Smoothly interpolates a numeric value — never ticks through integers.
 * Formats the raw float each frame; callers apply currency/share formatting.
 */
export function useNumberAnimation(
  target: number,
  transition: Transition = COUNTER_TRANSITION
): number {
  const motionValue = useMotionValue(target);
  const [displayValue, setDisplayValue] = useState(target);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplayValue(latest);
  });

  useEffect(() => {
    const controls = animate(motionValue, target, transition);
    return controls.stop;
  }, [target, transition, motionValue]);

  return displayValue;
}

/**
 * Wallet balance counter — steps in ~$50 whole-dollar increments over 400–500ms.
 */
export function useWalletBalanceAnimation(
  target: number,
  stepSize = 50,
  transition: Transition = COUNTER_TRANSITION
): number {
  const roundedTarget = Math.round(target);
  const motionValue = useMotionValue(roundedTarget);
  const [displayValue, setDisplayValue] = useState(roundedTarget);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  useEffect(() => {
    const from = Math.round(motionValue.get());
    const to = roundedTarget;
    const steps = generateDollarSteps(from, to, stepSize);

    if (steps.length <= 1) {
      motionValue.set(to);
      setDisplayValue(to);
      return;
    }

    const times = steps.map((_, index) => index / (steps.length - 1));
    const controls = animate(motionValue, steps, { ...transition, times });
    return controls.stop;
  }, [roundedTarget, stepSize, transition, motionValue]);

  return displayValue;
}
