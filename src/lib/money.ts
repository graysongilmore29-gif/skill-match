export const STARTING_BALANCE_CENTS = 25_000;
export const DEFAULT_STAKE_CENTS = 1_000;
export const TOP_UP_CENTS = 10_000;
export const MIN_STAKE_CENTS = 100;
export const MAX_STAKE_CENTS = 50_000;

export function formatPlayMoney(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  return `${sign}$${(Math.abs(cents) / 100).toFixed(2)}`;
}

export function dollarsToCents(value: string | number): number {
  const n = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(n)) return NaN;
  return Math.round(n * 100);
}

export function centsToDollarInput(cents: number): string {
  return (cents / 100).toFixed(2);
}
