"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_MOTION_PRESET,
  DEFAULT_SUCCESS_MOTION_CONFIG,
  MOTION_PRESETS,
  type MotionPresetName,
  type SuccessMotionConfig,
} from "@/lib/success-motion-config";

interface SuccessMotionContextValue {
  config: SuccessMotionConfig;
  activePreset: MotionPresetName;
  setValue: <K extends keyof SuccessMotionConfig>(
    section: K,
    key: keyof SuccessMotionConfig[K],
    value: number | boolean
  ) => void;
  applyPreset: (preset: MotionPresetName) => void;
  reset: () => void;
}

const SuccessMotionContext = createContext<SuccessMotionContextValue | null>(
  null
);

export function SuccessMotionProvider({ children }: { children: ReactNode }) {
  const [activePreset, setActivePreset] =
    useState<MotionPresetName>(DEFAULT_MOTION_PRESET);
  const [config, setConfig] = useState<SuccessMotionConfig>(
    DEFAULT_SUCCESS_MOTION_CONFIG
  );

  const setValue = useCallback<
    SuccessMotionContextValue["setValue"]
  >((section, key, value) => {
    setActivePreset("subtle");
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  }, []);

  const applyPreset = useCallback((preset: MotionPresetName) => {
    setActivePreset(preset);
    setConfig(MOTION_PRESETS[preset]);
  }, []);

  const reset = useCallback(() => {
    setActivePreset(DEFAULT_MOTION_PRESET);
    setConfig(DEFAULT_SUCCESS_MOTION_CONFIG);
  }, []);

  const value = useMemo(
    () => ({ config, activePreset, setValue, applyPreset, reset }),
    [activePreset, applyPreset, config, reset, setValue]
  );

  return (
    <SuccessMotionContext.Provider value={value}>
      {children}
    </SuccessMotionContext.Provider>
  );
}

export function useSuccessMotion() {
  const context = useContext(SuccessMotionContext);
  if (!context) {
    return {
      config: DEFAULT_SUCCESS_MOTION_CONFIG,
      activePreset: DEFAULT_MOTION_PRESET,
      setValue: () => undefined,
      applyPreset: () => undefined,
      reset: () => undefined,
    };
  }
  return context;
}
