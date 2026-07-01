"use client";

import { AnimatePresence, motion } from "framer-motion";

import { EASING } from "@/lib/animation";
import { sanitizeCurrencyInput } from "@/lib/helpers";
import { cn } from "@/lib/utils";

import type { InputHTMLAttributes } from "react";

const HELPER_FADE_MS = 0.15;

export interface AmountInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  value?: string;
  onValueChange?: (value: string) => void;
  error?: boolean;
  helperMessage?: string;
  showHelper?: boolean;
}

export function AmountInput({
  value = "",
  onValueChange,
  error = false,
  helperMessage,
  showHelper = false,
  className,
  onChange,
  ...props
}: AmountInputProps) {
  const isEmpty = !value || value === "0" || value === "0.";

  return (
    <div
      data-component="amount-input"
      className={cn(
        "bg-surface relative flex items-center justify-between overflow-hidden px-[12px] py-[20px]",
        className
      )}
    >
      <input
        type="text"
        inputMode="decimal"
        data-component="amount-input-field"
        className={cn(
          "min-w-0 flex-1 bg-transparent text-[24px] font-semibold leading-normal tracking-[-0.24px] outline-none transition-colors",
          error
            ? "text-[#EC2D2D]"
            : isEmpty
              ? "text-text-placeholder"
              : "text-text-primary"
        )}
        style={{ transitionDuration: `${HELPER_FADE_MS}s` }}
        value={value}
        placeholder="$0.00"
        onChange={(event) => {
          const sanitized = sanitizeCurrencyInput(event.target.value);
          onChange?.(event);
          onValueChange?.(sanitized);
        }}
        {...props}
      />
      <AnimatePresence>
        {showHelper && helperMessage ? (
          <motion.span
            key="helper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: HELPER_FADE_MS, ease: EASING.easeOut }}
            className="pointer-events-none absolute right-[12px] whitespace-nowrap text-[13px] font-normal leading-normal tracking-[-0.13px] text-[#EC2D2D]"
          >
            {helperMessage}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
