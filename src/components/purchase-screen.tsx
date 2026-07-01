"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import {
  CertificateDownloadScreen,
  PrimaryButton,
  PurchaseLoadingScreen,
  PurchaseSuccessScreen,
  StockCard,
  WalletCard,
} from "@/components";
import { useDebounce } from "@/hooks/use-debounce";
import { DURATION, EASING } from "@/lib/animation";
import {
  isValidPurchaseAmount,
  parseAmount,
  sanitizeCurrencyInput,
} from "@/lib/helpers";
import { DEFAULT_STOCK, type Stock } from "@/lib/stocks";

const WALLET_BALANCE = 4830;

type PurchasePhase = "input" | "loading" | "success" | "explore";

export function PurchaseScreen() {
  const [phase, setPhase] = useState<PurchasePhase>("input");
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock>(DEFAULT_STOCK);
  const [amountInput, setAmountInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [showInsufficientHelper, setShowInsufficientHelper] = useState(false);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const amount = parseAmount(amountInput);
  const debouncedAmount = useDebounce(amount, DURATION.walletDebounce * 1000);
  const canPurchase = isValidPurchaseAmount(amount, WALLET_BALANCE);
  const purchasedShares =
    selectedStock.price > 0 ? amount / selectedStock.price : 0;

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  const triggerInsufficientFeedback = useCallback(() => {
    clearFeedbackTimeout();
    setInputError(true);
    setShowInsufficientHelper(true);

    feedbackTimeoutRef.current = setTimeout(() => {
      setInputError(false);
      setShowInsufficientHelper(false);
      feedbackTimeoutRef.current = null;
    }, DURATION.insufficientFundsMessage * 1000);
  }, [clearFeedbackTimeout]);

  const handleAmountChange = useCallback(
    (raw: string) => {
      const sanitized = sanitizeCurrencyInput(raw);
      const parsed = parseAmount(sanitized);

      if (parsed > WALLET_BALANCE) {
        triggerInsufficientFeedback();
        return;
      }

      clearFeedbackTimeout();
      setInputError(false);
      setShowInsufficientHelper(false);
      setAmountInput(sanitized);
    },
    [clearFeedbackTimeout, triggerInsufficientFeedback]
  );

  const handlePurchase = useCallback(() => {
    if (!canPurchase) return;
    setPhase("loading");
    setShowLoadingOverlay(true);
  }, [canPurchase]);

  const handleLoadingTransitionStart = useCallback(() => {
    setPhase("success");
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setShowLoadingOverlay(false);
  }, []);

  const handleSelectStock = useCallback((stock: Stock) => {
    setSelectedStock(stock);
    setAmountInput("");
    setInputError(false);
    setShowInsufficientHelper(false);
    clearFeedbackTimeout();
    setPhase("input");
  }, [clearFeedbackTimeout]);

  const handleContinueHome = useCallback(() => {
    setSelectedStock(DEFAULT_STOCK);
    setAmountInput("");
    setInputError(false);
    setShowInsufficientHelper(false);
    clearFeedbackTimeout();
    setPhase("input");
  }, [clearFeedbackTimeout]);

  useEffect(() => clearFeedbackTimeout, [clearFeedbackTimeout]);

  if (phase === "loading" || phase === "success") {
    return (
      <div className="relative min-h-screen w-full bg-page">
        {showLoadingOverlay && (
          <PurchaseLoadingScreen
            shares={purchasedShares}
            stockLogoSrc={selectedStock.logoSrc}
            stockLogoClassName={selectedStock.logoClassName}
            onTransitionStart={handleLoadingTransitionStart}
            onComplete={handleLoadingComplete}
          />
        )}
        {phase === "success" && (
          <PurchaseSuccessScreen
            shares={purchasedShares}
            price={selectedStock.price}
            symbol={selectedStock.symbol}
            companyName={selectedStock.certificateName}
            enterOnMount={showLoadingOverlay}
            onDownloadComplete={() => setPhase("explore")}
          />
        )}
      </div>
    );
  }

  if (phase === "explore") {
    return (
      <CertificateDownloadScreen
        onSelectStock={handleSelectStock}
        onContinueHome={handleContinueHome}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-page">
      <div className="absolute left-1/2 top-1/2 flex w-[400px] max-w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-[24px]">
        <header className="flex h-[61px] w-full max-w-[400px] shrink-0 flex-col items-start justify-center gap-[4px]">
          <h1 className="w-full shrink-0 text-[32px] font-semibold leading-[normal] tracking-[-0.64px]">
            <span className="text-text-secondary">Market Buy</span>
            <span className="text-text-primary"> #{selectedStock.symbol}</span>
          </h1>
          <p className="w-full shrink-0 text-[15px] font-normal leading-[1.5rem] tracking-[-0.3px] text-text-secondary">
            Stock purchase will be done at the current price.
          </p>
        </header>

        <div className="flex w-full max-w-[400px] shrink-0 flex-col items-start gap-[16px]">
          <div className="flex w-full flex-col gap-[8px]">
            <WalletCard
              balance={WALLET_BALANCE}
              amount={debouncedAmount}
              amountInput={amountInput}
              onAmountChange={handleAmountChange}
              inputError={inputError}
              showInsufficientHelper={showInsufficientHelper}
            />
            <StockCard
              name={selectedStock.name}
              symbol={selectedStock.symbol}
              price={selectedStock.price}
              priceChange={selectedStock.priceChange}
              priceChangePercent={selectedStock.priceChangePercent}
              logoSrc={selectedStock.logoSrc}
              logoClassName={selectedStock.logoClassName}
              amount={amount}
            />
          </div>

          <motion.div
            className="w-full"
            initial={false}
            animate={{
              opacity: canPurchase ? 1 : 0,
              y: canPurchase ? 0 : 6,
            }}
            transition={{ duration: 0.28, ease: EASING.easeOut }}
            style={{ pointerEvents: canPurchase ? "auto" : "none" }}
          >
            <PrimaryButton enabled={canPurchase} onClick={handlePurchase}>
              Buy Stock
            </PrimaryButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
