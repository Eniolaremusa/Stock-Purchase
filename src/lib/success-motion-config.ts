/** Centralized success-screen motion parameters (dev-tunable). */

export type MotionPresetName = "subtle" | "premium" | "expressive" | "motionOff";

export interface SuccessMotionConfig {
  general: {
    motionEnabled: boolean;
    staggerDelayMs: number;
    revealDurationMs: number;
    hoverResponseSpeed: number;
  };
  stamp: {
    initialScale: number;
    impactScale: number;
    finalScale: number;
    initialRotation: number;
    finalRotation: number;
    initialYOffset: number;
    impactDurationMs: number;
    settleDurationMs: number;
    delayBeforeStampMs: number;
    opacity: number;
    initialOpacity: number;
  };
  tilt: {
    maxRotationX: number;
    maxRotationY: number;
    perspective: number;
    springStiffness: number;
    springDamping: number;
    returnDurationMs: number;
  };
  shadow: {
    blur: number;
    opacity: number;
    distance: number;
    offsetX: number;
    offsetY: number;
    maxOffset: number;
  };
  shine: {
    intensity: number;
    angle: number;
    speed: number;
    opacity: number;
    width: number;
    /** Warm paper highlight — rgba(255,252,245,α) */
    highlightAlpha: number;
  };
  download: {
    pullDurationMs: number;
    pullDistancePx: number;
    taperAmount: number;
    concavityAmount: number;
    compressionSpeed: number;
    fadeStart: number;
    fadeDurationMs: number;
    transitionDelayMs: number;
  };
  explore: {
    cardHoverScale: number;
    cardHoverTranslateY: number;
    cardRecedeOpacity: number;
    cardRecedeScale: number;
    ctaDurationMs: number;
    screenTransitionMs: number;
    screenEnterTranslateY: number;
  };
}

export const DEFAULT_SUCCESS_MOTION_CONFIG: SuccessMotionConfig = {
  general: {
    motionEnabled: true,
    staggerDelayMs: 180,
    revealDurationMs: 520,
    hoverResponseSpeed: 1,
  },
  stamp: {
    initialScale: 1.18,
    impactScale: 0.92,
    finalScale: 1,
    initialRotation: -2,
    finalRotation: 0,
    initialYOffset: -10,
    impactDurationMs: 65,
    settleDurationMs: 155,
    delayBeforeStampMs: 0,
    opacity: 1,
    initialOpacity: 0,
  },
  tilt: {
    maxRotationX: 5.175,
    maxRotationY: 6.9,
    perspective: 1400,
    springStiffness: 200,
    springDamping: 22,
    returnDurationMs: 550,
  },
  shadow: {
    blur: 10,
    opacity: 0.09,
    distance: 5,
    offsetX: 0,
    offsetY: 3,
    maxOffset: 8,
  },
  shine: {
    intensity: 0.85,
    angle: 125,
    speed: 1.1,
    opacity: 0.22,
    width: 42,
    highlightAlpha: 0.12,
  },
  download: {
    pullDurationMs: 920,
    pullDistancePx: 200,
    taperAmount: 0.92,
    concavityAmount: 0.38,
    compressionSpeed: 1.45,
    fadeStart: 0.84,
    fadeDurationMs: 110,
    transitionDelayMs: 40,
  },
  explore: {
    cardHoverScale: 1.03,
    cardHoverTranslateY: -6,
    cardRecedeOpacity: 0.95,
    cardRecedeScale: 0.99,
    ctaDurationMs: 180,
    screenTransitionMs: 200,
    screenEnterTranslateY: 12,
  },
};

export const MOTION_PRESETS: Record<MotionPresetName, SuccessMotionConfig> = {
  subtle: DEFAULT_SUCCESS_MOTION_CONFIG,
  premium: {
    ...DEFAULT_SUCCESS_MOTION_CONFIG,
    general: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.general,
      staggerDelayMs: 200,
      revealDurationMs: 560,
      hoverResponseSpeed: 0.85,
    },
    tilt: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.tilt,
      maxRotationX: 2.5,
      maxRotationY: 3.5,
      springStiffness: 150,
      springDamping: 28,
    },
    shadow: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.shadow,
      blur: 12,
      opacity: 0.08,
      maxOffset: 7,
    },
    shine: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.shine,
      opacity: 0.18,
      highlightAlpha: 0.1,
    },
    download: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.download,
      pullDurationMs: 980,
      concavityAmount: 0.32,
    },
    explore: DEFAULT_SUCCESS_MOTION_CONFIG.explore,
  },
  expressive: {
    ...DEFAULT_SUCCESS_MOTION_CONFIG,
    general: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.general,
      staggerDelayMs: 140,
      revealDurationMs: 480,
      hoverResponseSpeed: 1.25,
    },
    stamp: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.stamp,
      initialScale: 1.24,
      impactScale: 0.88,
      impactDurationMs: 55,
      settleDurationMs: 180,
    },
    tilt: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.tilt,
      maxRotationX: 4.5,
      maxRotationY: 6,
      springStiffness: 200,
      springDamping: 22,
    },
    shadow: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.shadow,
      blur: 14,
      opacity: 0.12,
      maxOffset: 11,
    },
    shine: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.shine,
      opacity: 0.28,
      width: 48,
      highlightAlpha: 0.15,
    },
    download: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.download,
      pullDurationMs: 860,
      concavityAmount: 0.48,
      compressionSpeed: 1.65,
    },
    explore: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.explore,
      cardHoverScale: 1.035,
    },
  },
  motionOff: {
    ...DEFAULT_SUCCESS_MOTION_CONFIG,
    general: {
      motionEnabled: false,
      staggerDelayMs: 0,
      revealDurationMs: 0,
      hoverResponseSpeed: 0,
    },
    stamp: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.stamp,
      initialScale: 1,
      impactScale: 1,
      initialYOffset: 0,
      initialRotation: 0,
      impactDurationMs: 0,
      settleDurationMs: 0,
      delayBeforeStampMs: 0,
      initialOpacity: 1,
    },
    tilt: {
      maxRotationX: 0,
      maxRotationY: 0,
      perspective: 1400,
      springStiffness: 300,
      springDamping: 40,
      returnDurationMs: 0,
    },
    shadow: {
      blur: 8,
      opacity: 0.08,
      distance: 4,
      offsetX: 0,
      offsetY: 2,
      maxOffset: 0,
    },
    shine: {
      intensity: 0,
      angle: 125,
      speed: 0,
      opacity: 0,
      width: 38,
      highlightAlpha: 0,
    },
    download: {
      pullDurationMs: 0,
      pullDistancePx: 120,
      taperAmount: 0.9,
      concavityAmount: 0.3,
      compressionSpeed: 1,
      fadeStart: 0.5,
      fadeDurationMs: 0,
      transitionDelayMs: 0,
    },
    explore: {
      ...DEFAULT_SUCCESS_MOTION_CONFIG.explore,
      screenTransitionMs: 0,
      screenEnterTranslateY: 0,
    },
  },
};

export const DEFAULT_MOTION_PRESET: MotionPresetName = "subtle";
