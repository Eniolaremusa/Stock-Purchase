"use client";

import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { motion, useAnimation, type HTMLMotionProps } from "framer-motion";

import { useSuccessMotion } from "@/contexts/success-motion-context";
import { useCertificateInteraction } from "@/hooks/use-certificate-interaction";
import { EASING } from "@/lib/animation";
import { formatCurrency, formatShares } from "@/lib/helpers";
import { cn } from "@/lib/utils";

const EASE_OUT = EASING.easeOut;

export interface CertificateHandle {
  playStampStrike: () => Promise<void>;
  getCaptureElement: () => HTMLElement | null;
}

const DEFAULT_OWNER_NAME = "Eniola Remusa";
const OWNER_NAME_TYPOGRAPHY =
  "font-lastik shrink-0 whitespace-nowrap text-[24px] leading-normal text-[#5b5855]";

export interface CertificateProps extends Omit<HTMLMotionProps<"div">, "children"> {
  ownerName?: string;
  onOwnerNameChange?: (name: string) => void;
  shares: number;
  price: number;
  purchaseDate: string;
  companyName?: string;
  interactionDisabled?: boolean;
}

function OwnershipStamp({
  className,
  ...props
}: Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      data-component="ownership-stamp"
      className={cn("pointer-events-none absolute z-20", className)}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      <div className="relative size-[106.062px] rotate-[-4.09deg]">
        <div className="absolute inset-[2.15%_3.9%]">
          <Image
            src="/assets/stamp-star-outer.svg"
            alt=""
            width={106}
            height={106}
            className="block size-full max-w-none"
          />
        </div>
        <div className="absolute left-[13.41px] top-[11.48px] h-[84.85px] w-[80.697px]">
          <div className="absolute inset-[2.39%_1.7%]">
            <Image
              src="/assets/stamp-star-middle.svg"
              alt=""
              width={81}
              height={85}
              className="block size-full max-w-none"
            />
          </div>
        </div>
        <div className="absolute left-[11.33px] top-[11.62px] size-[84.85px]">
          <div className="absolute inset-[1.14%_2.82%]">
            <Image
              src="/assets/stamp-star-inner.svg"
              alt=""
              width={85}
              height={85}
              className="block size-full max-w-none"
            />
          </div>
        </div>
        <p className="font-inter absolute left-1/2 top-[38px] w-[78.486px] -translate-x-1/2 text-center text-[10.606px] font-bold uppercase leading-normal tracking-[-0.2121px] text-[#703f13]">
          Trade confirmed
        </p>
      </div>
    </motion.div>
  );
}

function SignatureBlock() {
  return (
    <div
      data-component="signature-block"
      data-node-id="41:454"
      className="relative flex w-[158px] shrink-0 flex-col items-center justify-center"
    >
      <div
        data-node-id="43:467"
        className="relative h-[32px] w-[30px] shrink-0"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Figma 43:467 — percentage crop trims vertical paper margins */}
          <img
            alt=""
            src="/assets/signature-figma.png"
            className="absolute left-[-16.59%] top-[-30.97%] h-[162.5%] w-[136.84%] max-w-none"
          />
        </div>
      </div>
      <p className="font-inter relative w-min min-w-full shrink-0 text-center text-[12px] font-medium leading-[18px] tracking-[-0.24px] text-[#0a0a09]">
        Lewis Anderson
      </p>
      <p className="font-inter relative w-min min-w-full shrink-0 text-center text-[12px] font-medium leading-[18px] tracking-[-0.24px] text-[#5b5855]">
        President
      </p>
    </div>
  );
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function EditableOwnerName({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (name: string) => void;
  disabled?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editing]);

  const finishEditing = () => {
    setEditing(false);
    onChange(value.trim() || DEFAULT_OWNER_NAME);
  };

  if (editing && !disabled) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        aria-label="Certificate recipient name"
        onChange={(event) => onChange(event.target.value)}
        onBlur={finishEditing}
        onKeyDown={(event) => {
          if (event.key === "Enter") finishEditing();
          if (event.key === "Escape") finishEditing();
        }}
        className={cn(
          OWNER_NAME_TYPOGRAPHY,
          "pointer-events-auto m-0 w-full min-w-[8ch] border-0 bg-transparent p-0 text-center outline-none focus:ring-0"
        )}
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Edit certificate recipient name"
      onClick={() => {
        if (!disabled) setEditing(true);
      }}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setEditing(true);
        }
      }}
      className={cn(
        OWNER_NAME_TYPOGRAPHY,
        "pointer-events-auto",
        disabled ? "cursor-default" : "cursor-text"
      )}
    >
      {value}
    </span>
  );
}

export const Certificate = forwardRef<CertificateHandle, CertificateProps>(
  function Certificate(
    {
      ownerName = DEFAULT_OWNER_NAME,
      onOwnerNameChange,
      shares,
      price,
      purchaseDate,
      companyName = "Eli Lily and Company",
      className,
      initial,
      animate,
      interactionDisabled = false,
      ...props
    },
    ref
  ) {
    const { config } = useSuccessMotion();
    const stampControls = useAnimation();
    const strikePlayedRef = useRef(false);
    const captureRef = useRef<HTMLDivElement>(null);
    const [displayName, setDisplayName] = useState(ownerName);
    const formattedShares = formatShares(shares);
    const formattedPrice = formatCurrency(price);

    useEffect(() => {
      setDisplayName(ownerName);
    }, [ownerName]);

    const handleOwnerNameChange = (name: string) => {
      setDisplayName(name);
      onOwnerNameChange?.(name);
    };

    const {
      cardRef,
      perspective,
      rotateX,
      rotateY,
      shineOpacity,
      shineBackground,
      handleMouseMove,
      handleMouseLeave,
    } = useCertificateInteraction();

    useImperativeHandle(ref, () => ({
      getCaptureElement: () => captureRef.current,
      playStampStrike: async () => {
        if (strikePlayedRef.current) return;
        strikePlayedRef.current = true;

        const { stamp } = config;
        await wait(stamp.delayBeforeStampMs);

        if (!config.general.motionEnabled) {
          await stampControls.set({
            opacity: stamp.opacity,
            scale: stamp.finalScale,
            y: 0,
            rotate: stamp.finalRotation,
            visibility: "visible",
          });
          return;
        }

        await stampControls.set({ visibility: "visible" });

        await stampControls.start({
          opacity: stamp.opacity,
          y: 0,
          scale: stamp.impactScale,
          rotate: stamp.initialRotation * 0.4,
          transition: {
            duration: stamp.impactDurationMs / 1000,
            ease: EASE_OUT,
          },
        });

        await stampControls.start({
          scale: stamp.finalScale,
          rotate: stamp.finalRotation,
          transition: {
            duration: stamp.settleDurationMs / 1000,
            ease: EASE_OUT,
          },
        });
      },
    }));

    useEffect(() => {
      if (strikePlayedRef.current) return;
      const { stamp } = config;
      stampControls.set({
        opacity: stamp.initialOpacity,
        scale: stamp.initialScale,
        y: stamp.initialYOffset,
        rotate: stamp.initialRotation,
        visibility: "hidden",
      });
    }, [config.stamp, stampControls]);

    return (
      <motion.div
        data-component="certificate-root"
        className={cn("relative w-[600px] shrink-0", className)}
        initial={initial}
        animate={animate}
        {...props}
      >
        <div
          ref={cardRef}
          className="relative h-[400px] w-[600px]"
          style={{ perspective }}
          onMouseMove={interactionDisabled ? undefined : handleMouseMove}
          onMouseLeave={interactionDisabled ? undefined : handleMouseLeave}
        >
          <motion.div
            ref={captureRef}
            data-component="certificate-frame"
            className="relative h-[400px] w-[600px] overflow-visible drop-shadow-[0px_2px_2px_rgba(0,0,0,0.08),0px_0px_4px_rgba(0,0,0,0.08)]"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              data-component="certificate"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2">
                <Image
                  src="/assets/certificate-paper.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="600px"
                  priority
                />
              </div>

              <motion.div
                aria-hidden
                className="absolute inset-0 z-10 mix-blend-soft-light"
                style={{
                  opacity: shineOpacity,
                  background: shineBackground,
                }}
              />

              <div className="absolute left-1/2 top-[calc(50%-125px)] flex h-[77px] w-[253px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[14px] text-[#5b5855]">
                <p className="font-lastik w-full shrink-0 text-center text-[32px] leading-normal">
                  Certificate of Stock
                </p>
                <p className="font-inter w-full shrink-0 text-center text-[15px] font-normal leading-normal tracking-[-0.3px]">
                  This certifies that
                </p>
              </div>

              <div className="absolute left-1/2 top-[calc(50%+10.5px)] flex w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[12px]">
                <div className="flex w-full flex-col items-start gap-[12px]">
                  <div className="flex w-full flex-col items-center gap-[4px]">
                    <EditableOwnerName
                      value={displayName}
                      onChange={handleOwnerNameChange}
                      disabled={interactionDisabled}
                    />
                    <div className="relative h-0 w-full shrink-0">
                      <div className="absolute inset-[-1px_0_0_0]">
                        <Image
                          src="/assets/certificate-name-line.svg"
                          alt=""
                          width={400}
                          height={1}
                          className="block size-full max-w-none"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="font-inter w-full text-center text-[13px] leading-[19px] tracking-[-0.26px] text-[#0a0a09]">
                    <span>is the owner of </span>
                    <span className="font-medium">{formattedShares} </span>
                    <span>shares of stocks of </span>
                    <span className="font-bold">{companyName},</span>
                    <span className="font-bold"> </span>
                    <span>on the </span>
                    <span className="font-semibold">{purchaseDate}</span>
                    <span> at a price of </span>
                    <span className="font-semibold">{formattedPrice}</span>
                    <span> per share.</span>
                  </p>
                </div>

                <div className="font-inter w-full whitespace-pre-wrap text-center text-[13px] leading-[18px] tracking-[-0.26px] text-[#5b5855]">
                  <p className="mb-0">
                    This certificate is non transferrable and intended for the
                    original
                  </p>
                  <p>recipient only. It cannot be sold or exchanged.</p>
                </div>
              </div>

              <div className="absolute left-1/2 top-[calc(50%+147.1px)] flex w-[500px] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-[64px]">
                <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[4px]">
                  <p className="font-inter whitespace-nowrap text-[10px] font-medium leading-normal tracking-[0.1px] text-[#5b5855]">
                    Certifications@elilily.com
                  </p>
                  <p className="font-inter text-[10px] font-medium leading-[16px] tracking-[0.1px] text-[#5b5855]">
                    12, Berkley Tower, Suite 400, San Francisco, CA.
                  </p>
                </div>

                <div className="relative size-[56px] shrink-0">
                  <Image
                    src="/assets/certificate-qr.svg"
                    alt=""
                    width={56}
                    height={56}
                    className="block size-full"
                  />
                </div>

                <SignatureBlock />
              </div>
            </div>

            <OwnershipStamp
              className="right-[-17px] top-[-23px]"
              animate={stampControls}
            />
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

Certificate.displayName = "Certificate";
