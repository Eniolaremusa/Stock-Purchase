/** Calm, premium NumberFlow timing — no slot-machine feel. */

export const NUMBER_FLOW_TIMING = {
  transformTiming: {
    duration: 450,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  spinTiming: {
    duration: 450,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  opacityTiming: {
    duration: 220,
    easing: "ease-out",
  },
  trend: 0 as const,
  respectMotionPreference: true,
};

export const WALLET_NUMBER_FORMAT = {
  style: "currency" as const,
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

export const SHARES_NUMBER_FORMAT = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
};
