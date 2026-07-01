/** Shared animation timing and easing constants for Framer Motion. */

export const DURATION = {
  fast: 0.15,
  button: 0.2,
  normal: 0.3,
  counter: 0.45,
  shares: 0.56,
  slow: 0.5,
  insufficientFunds: 0.5,
  insufficientFundsMessage: 0.9,
  walletDebounce: 0.9,
} as const;

export const EASING = {
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,
} as const;

export const SPRING = {
  counter: {
    type: "spring" as const,
    stiffness: 220,
    damping: 30,
    mass: 1,
  },
  button: {
    type: "spring" as const,
    stiffness: 260,
    damping: 28,
    mass: 0.9,
  },
} as const;

export const COUNTER_TRANSITION = {
  duration: DURATION.counter,
  ease: EASING.easeOut,
} as const;

/** Shares counter — ~25% slower than wallet counter, same easing */
export const SHARES_COUNTER_TRANSITION = {
  duration: DURATION.shares,
  ease: EASING.easeOut,
} as const;

export const WALLET_COUNTER_TRANSITION = {
  duration: DURATION.counter,
  ease: EASING.easeOut,
} as const;

export const BUTTON_TRANSITION = {
  duration: DURATION.button,
  ease: EASING.easeOut,
} as const;

export const STAGGER = {
  children: 0.05,
} as const;

export const WALLET_BALANCE_STEP = 50;
