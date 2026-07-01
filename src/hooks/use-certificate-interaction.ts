"use client";

import {
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import { useCallback, useRef } from "react";

import { useSuccessMotion } from "@/contexts/success-motion-context";

export function useCertificateInteraction() {
  const { config } = useSuccessMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const motionEnabled = config.general.motionEnabled;

  const spring = {
    stiffness: config.tilt.springStiffness,
    damping: config.tilt.springDamping,
  };

  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const shineOpacity = useSpring(0, spring);
  const shineX = useSpring(50, spring);
  const shineY = useSpring(50, spring);

  const shineBackground = useMotionTemplate`radial-gradient(ellipse 80% 60% at ${shineX}% ${shineY}%, rgba(255, 252, 245, ${config.shine.highlightAlpha * config.shine.intensity}) 0%, rgba(255, 252, 245, 0) 68%)`;

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!motionEnabled) return;

      const element = cardRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      const cx = nx - 0.5;
      const cy = ny - 0.5;
      const speed = config.general.hoverResponseSpeed;

      rotateY.set(cx * config.tilt.maxRotationY * 2 * speed);
      rotateX.set(-cy * config.tilt.maxRotationX * 2 * speed);
      shineOpacity.set(config.shine.opacity);
      shineX.set(50 - cx * config.shine.width * config.shine.speed);
      shineY.set(50 - cy * config.shine.width * config.shine.speed);
    },
    [config, motionEnabled, rotateX, rotateY, shineOpacity, shineX, shineY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    shineOpacity.set(0);
    shineX.set(50);
    shineY.set(50);
  }, [rotateX, rotateY, shineOpacity, shineX, shineY]);

  return {
    cardRef,
    perspective: config.tilt.perspective,
    motionEnabled,
    rotateX,
    rotateY,
    shineOpacity,
    shineBackground,
    handleMouseMove,
    handleMouseLeave,
  };
}
