"use client";

import NumberFlow from "@number-flow/react";

import type { HTMLAttributes } from "react";

import { AmountInput } from "@/components/amount-input";
import {
  NUMBER_FLOW_TIMING,
  WALLET_NUMBER_FORMAT,
} from "@/lib/number-flow-config";
import { cn } from "@/lib/utils";

export interface WalletCardProps extends HTMLAttributes<HTMLDivElement> {
  balance?: number;
  /** Debounced amount — drives wallet balance animation after typing pauses */
  amount?: number;
  amountInput?: string;
  onAmountChange?: (value: string) => void;
  inputError?: boolean;
  showInsufficientHelper?: boolean;
}

export function WalletCard({
  balance = 4830,
  amount = 0,
  amountInput = "",
  onAmountChange,
  inputError = false,
  showInsufficientHelper = false,
  className,
  ...props
}: WalletCardProps) {
  const targetBalance = balance - amount;

  return (
    <div
      data-component="wallet-card"
      className={cn("flex w-full flex-col gap-[2px]", className)}
      {...props}
    >
      <div className="bg-surface flex w-full shrink-0 items-center gap-[8px] overflow-hidden rounded-tl-[16px] rounded-tr-[16px] p-[12px]">
        <div className="flex size-[28px] shrink-0 items-center justify-center overflow-hidden rounded-[100px] bg-wallet-icon">
          <span className="text-[15px] font-medium leading-none tracking-[-0.15px] text-white">
            $
          </span>
        </div>
        <div className="flex min-w-px flex-1 flex-col gap-[2px] text-[13px] leading-normal tracking-[-0.13px]">
          <p className="w-min min-w-full shrink-0 font-semibold text-text-primary">
            USD Wallet
          </p>
          <p className="shrink-0 whitespace-nowrap font-normal text-text-secondary [font-variant-numeric:tabular-nums]">
            <NumberFlow
              value={targetBalance}
              format={WALLET_NUMBER_FORMAT}
              locales="en-US"
              {...NUMBER_FLOW_TIMING}
            />
          </p>
        </div>
      </div>
      <AmountInput
        value={amountInput}
        onValueChange={onAmountChange}
        error={inputError}
        showHelper={showInsufficientHelper}
        helperMessage="Insufficient balance"
        className="rounded-bl-[16px] rounded-br-[16px]"
        aria-label="Purchase amount"
      />
    </div>
  );
}
