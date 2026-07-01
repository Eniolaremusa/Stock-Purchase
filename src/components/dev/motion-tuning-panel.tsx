"use client";

import {
  MOTION_PRESETS,
  type MotionPresetName,
} from "@/lib/success-motion-config";
import { useSuccessMotion } from "@/contexts/success-motion-context";
import type { SuccessMotionConfig } from "@/lib/success-motion-config";

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-[11px] text-[#5b5855]">
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="tabular-nums text-[#0a0a09]">
          {step < 1 ? value.toFixed(2) : Math.round(value)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1 w-full cursor-pointer accent-[#1f5fe0]"
      />
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-[#e8e4dc] pt-3 first:border-t-0 first:pt-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0a0a09]">
        {title}
      </p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

const PRESET_LABELS: Record<MotionPresetName, string> = {
  subtle: "Subtle (default)",
  premium: "Premium",
  expressive: "Expressive",
  motionOff: "Motion Off",
};

export function MotionTuningPanel() {
  if (process.env.NODE_ENV !== "development") return null;

  const { config, activePreset, setValue, applyPreset, reset } = useSuccessMotion();

  const bind = <K extends keyof SuccessMotionConfig>(
    section: K,
    key: keyof SuccessMotionConfig[K]
  ) => ({
    value: config[section][key] as number,
    onChange: (value: number) => setValue(section, key, value),
  });

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-h-[min(80vh,720px)] w-[280px] overflow-y-auto rounded-xl border border-[#e8e4dc] bg-[#fffefb]/95 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[12px] font-semibold text-[#0a0a09]">Motion Tuning</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md px-2 py-1 text-[10px] font-medium text-[#1f5fe0] hover:bg-[#f7f4ed]"
        >
          Reset
        </button>
      </div>

      <Section title="Motion Presets">
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(MOTION_PRESETS) as MotionPresetName[]).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors ${
                activePreset === preset
                  ? "bg-[#1f5fe0] text-white"
                  : "bg-[#f7f4ed] text-[#5b5855] hover:bg-[#f3eee3]"
              }`}
            >
              {PRESET_LABELS[preset]}
            </button>
          ))}
        </div>
      </Section>

      <Section title="General">
        <SliderControl label="Stagger Delay (ms)" min={0} max={400} step={10} {...bind("general", "staggerDelayMs")} />
        <SliderControl label="Reveal Duration (ms)" min={200} max={900} step={10} {...bind("general", "revealDurationMs")} />
        <SliderControl label="Hover Response Speed" min={0.2} max={2} step={0.05} {...bind("general", "hoverResponseSpeed")} />
      </Section>

      <Section title="Stamp">
        <SliderControl label="Initial Scale" min={1} max={1.4} step={0.01} {...bind("stamp", "initialScale")} />
        <SliderControl label="Impact Scale" min={0.7} max={1} step={0.01} {...bind("stamp", "impactScale")} />
        <SliderControl label="Final Scale" min={0.9} max={1.1} step={0.01} {...bind("stamp", "finalScale")} />
        <SliderControl label="Initial Rotation (°)" min={-8} max={8} step={0.1} {...bind("stamp", "initialRotation")} />
        <SliderControl label="Initial Y Offset (px)" min={-20} max={0} step={1} {...bind("stamp", "initialYOffset")} />
        <SliderControl label="Impact Duration (ms)" min={20} max={200} step={5} {...bind("stamp", "impactDurationMs")} />
        <SliderControl label="Settle Duration (ms)" min={80} max={400} step={10} {...bind("stamp", "settleDurationMs")} />
        <SliderControl label="Delay Before Stamp (ms)" min={0} max={500} step={10} {...bind("stamp", "delayBeforeStampMs")} />
        <SliderControl label="Opacity" min={0} max={1} step={0.05} {...bind("stamp", "opacity")} />
      </Section>

      <Section title="Certificate Tilt">
        <SliderControl label="Max Rotation X (°)" min={0} max={8} step={0.1} {...bind("tilt", "maxRotationX")} />
        <SliderControl label="Max Rotation Y (°)" min={0} max={10} step={0.1} {...bind("tilt", "maxRotationY")} />
        <SliderControl label="Perspective (px)" min={600} max={2000} step={50} {...bind("tilt", "perspective")} />
        <SliderControl label="Spring Stiffness" min={80} max={400} step={5} {...bind("tilt", "springStiffness")} />
        <SliderControl label="Spring Damping" min={10} max={40} step={1} {...bind("tilt", "springDamping")} />
        <SliderControl label="Return Duration (ms)" min={200} max={900} step={10} {...bind("tilt", "returnDurationMs")} />
      </Section>

      <Section title="Dynamic Shadow">
        <SliderControl label="Shadow Blur (px)" min={0} max={24} step={1} {...bind("shadow", "blur")} />
        <SliderControl label="Shadow Opacity" min={0} max={0.3} step={0.01} {...bind("shadow", "opacity")} />
        <SliderControl label="Shadow Distance (px)" min={0} max={16} step={1} {...bind("shadow", "distance")} />
        <SliderControl label="Shadow Offset X (px)" min={-12} max={12} step={1} {...bind("shadow", "offsetX")} />
        <SliderControl label="Shadow Offset Y (px)" min={-4} max={16} step={1} {...bind("shadow", "offsetY")} />
        <SliderControl label="Max Shadow Offset (px)" min={0} max={16} step={1} {...bind("shadow", "maxOffset")} />
      </Section>

      <Section title="Download Animation">
        <SliderControl label="Pull Duration (ms)" min={400} max={1600} step={10} {...bind("download", "pullDurationMs")} />
        <SliderControl label="Pull Distance (px)" min={80} max={320} step={4} {...bind("download", "pullDistancePx")} />
        <SliderControl label="Taper Amount" min={0.4} max={1} step={0.01} {...bind("download", "taperAmount")} />
        <SliderControl label="Concavity Amount" min={0} max={0.8} step={0.01} {...bind("download", "concavityAmount")} />
        <SliderControl label="Compression Speed" min={0.8} max={2.5} step={0.05} {...bind("download", "compressionSpeed")} />
        <SliderControl label="Fade Start" min={0.5} max={0.98} step={0.01} {...bind("download", "fadeStart")} />
        <SliderControl label="Fade Duration (ms)" min={40} max={300} step={5} {...bind("download", "fadeDurationMs")} />
        <SliderControl label="Transition Delay (ms)" min={0} max={300} step={10} {...bind("download", "transitionDelayMs")} />
      </Section>

      <Section title="Paper Shine">
        <SliderControl label="Shine Intensity" min={0} max={1} step={0.05} {...bind("shine", "intensity")} />
        <SliderControl label="Shine Angle (°)" min={0} max={360} step={5} {...bind("shine", "angle")} />
        <SliderControl label="Shine Speed" min={0.2} max={2} step={0.05} {...bind("shine", "speed")} />
        <SliderControl label="Shine Opacity" min={0} max={0.4} step={0.01} {...bind("shine", "opacity")} />
        <SliderControl label="Shine Width" min={10} max={80} step={1} {...bind("shine", "width")} />
        <SliderControl label="Highlight Alpha" min={0} max={0.25} step={0.01} {...bind("shine", "highlightAlpha")} />
      </Section>
    </div>
  );
}
