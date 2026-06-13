export type CurrencyCode = "PKR" | "CLP";

/** 1 CLP = 0.31 PKR */
export const CLP_TO_PKR = 0.31;
export const PKR_TO_CLP = 1 / CLP_TO_PKR;

/** Chile petrol price per liter (Mar 2026 reference) */
export const PETROL_PRICE_CLP_PER_LITER = 1596.35;
export const PETROL_PRICE_PKR_PER_LITER = Math.round(PETROL_PRICE_CLP_PER_LITER * CLP_TO_PKR);

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  PKR: "Pakistani Rupee (₨)",
  CLP: "Chilean Peso ($)",
};

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value === "PKR" || value === "CLP";
}

export function toPKR(amount: number, currency: CurrencyCode): number {
  if (currency === "PKR") return amount;
  return amount * CLP_TO_PKR;
}

export function toCLP(amount: number, currency: CurrencyCode): number {
  if (currency === "CLP") return amount;
  return amount * PKR_TO_CLP;
}

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount;
  return to === "PKR" ? toPKR(amount, from) : toCLP(amount, from);
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const locale = currency === "CLP" ? "es-CL" : "en-PK";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === "CLP" ? 0 : 0,
  }).format(amount);
}

export function formatDualMoney(amount: number, sourceCurrency: CurrencyCode): string {
  const pkr = toPKR(amount, sourceCurrency);
  const clp = toCLP(amount, sourceCurrency);
  return `${formatMoney(pkr, "PKR")} · ${formatMoney(clp, "CLP")}`;
}

export function petrolRateForCurrency(currency: CurrencyCode): number {
  return currency === "CLP" ? PETROL_PRICE_CLP_PER_LITER : PETROL_PRICE_PKR_PER_LITER;
}

export function currencySymbol(currency: CurrencyCode): string {
  return currency === "CLP" ? "CLP" : "₨";
}
