/** General helper functions for the stock purchase prototype. */

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatAnimatedCurrency(value: number, currency = "USD"): string {
  const hasFraction = Math.abs(value % 1) > 0.001;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Whole dollars only — no cents */
export function formatWholeDollars(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatShares(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatAnimatedShares(value: number): string {
  if (Math.abs(value) < 0.00005) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(value);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function parseAmount(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function isValidPurchaseAmount(
  amount: number,
  balance: number
): boolean {
  return amount > 0 && amount <= balance;
}

/** Strip non-numeric characters; allow at most one decimal with up to 2 places */
export function sanitizeCurrencyInput(value: string): string {
  let cleaned = value.replace(/[^0-9.]/g, "");
  const dotIndex = cleaned.indexOf(".");

  if (dotIndex === -1) return cleaned;

  const whole = cleaned.slice(0, dotIndex);
  const fraction = cleaned.slice(dotIndex + 1).replace(/\./g, "").slice(0, 2);
  return `${whole}.${fraction}`;
}

/** Generate ~$50 stepped keyframes between two whole-dollar values */
export function generateDollarSteps(
  from: number,
  to: number,
  stepSize = 50
): number[] {
  const fromVal = Math.round(from);
  const toVal = Math.round(to);

  if (fromVal === toVal) return [toVal];

  const steps: number[] = [fromVal];
  const direction = toVal < fromVal ? -1 : 1;
  let current = fromVal;

  while (true) {
    const next = current + direction * stepSize;
    if (
      (direction < 0 && next <= toVal) ||
      (direction > 0 && next >= toVal)
    ) {
      steps.push(toVal);
      break;
    }
    steps.push(next);
    current = next;
  }

  return steps;
}
