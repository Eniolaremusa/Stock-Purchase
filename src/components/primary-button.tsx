"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import type { ReactNode } from "react";

import { BUTTON_TRANSITION, EASING } from "@/lib/animation";
import { BUTTON_TOKENS } from "@/lib/button-tokens";
import { cn } from "@/lib/utils";

export interface PrimaryButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  enabled?: boolean;
  children?: ReactNode;
}

const buttonVariants = {
  rest: { borderColor: BUTTON_TOKENS.borderColor },
  hover: { borderColor: BUTTON_TOKENS.backgroundColorHover },
  tap: { borderColor: BUTTON_TOKENS.backgroundColorHover },
} as const;

export function PrimaryButton({
  enabled = false,
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <motion.button
      type="button"
      data-component="primary-button"
      className={cn(
        "relative flex w-full max-w-[400px] shrink-0 items-center justify-center overflow-hidden",
        "border-solid px-[16px] py-[10px]",
        !enabled && "pointer-events-none",
        className
      )}
      style={{
        height: BUTTON_TOKENS.height,
        borderRadius: BUTTON_TOKENS.borderRadius,
        borderWidth: BUTTON_TOKENS.borderWidth,
        borderStyle: "solid",
      }}
      disabled={!enabled}
      variants={buttonVariants}
      initial="rest"
      animate={{ opacity: enabled ? 1 : BUTTON_TOKENS.disabledOpacity }}
      whileHover={enabled ? "hover" : undefined}
      whileTap={enabled ? "tap" : undefined}
      transition={{
        ...BUTTON_TRANSITION,
        borderColor: {
          duration: BUTTON_TOKENS.hoverTransitionDuration,
          ease: EASING.easeOut,
        },
      }}
      {...props}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[100px]"
        variants={{
          rest: { backgroundColor: BUTTON_TOKENS.backgroundColor },
          hover: { backgroundColor: BUTTON_TOKENS.backgroundColorHover },
          tap: { backgroundColor: BUTTON_TOKENS.backgroundColorHover },
        }}
        transition={{
          duration: BUTTON_TOKENS.hoverTransitionDuration,
          ease: EASING.easeOut,
        }}
      />
      <span
        className="relative shrink-0 whitespace-nowrap font-semibold text-white"
        style={{
          fontSize: BUTTON_TOKENS.fontSize,
          lineHeight: `${BUTTON_TOKENS.lineHeight}px`,
          letterSpacing: `${BUTTON_TOKENS.letterSpacing}px`,
          color: BUTTON_TOKENS.textColor,
        }}
      >
        {children}
      </span>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-[-2px] rounded-[inherit]"
        variants={{
          rest: { boxShadow: BUTTON_TOKENS.insetShadowDefault },
          hover: { boxShadow: BUTTON_TOKENS.insetShadowHover },
          tap: { boxShadow: BUTTON_TOKENS.insetShadowHover },
        }}
        transition={{
          duration: BUTTON_TOKENS.hoverTransitionDuration,
          ease: EASING.easeOut,
        }}
      />
    </motion.button>
  );
}
