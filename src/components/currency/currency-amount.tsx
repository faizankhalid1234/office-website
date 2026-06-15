import { cn } from "@/lib/utils";
import {
  type CurrencyCode,
  formatMoney,
  toCLP,
  toPKR,
} from "@/lib/currency";

interface CurrencyAmountProps {
  amount: number;
  currency?: CurrencyCode;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  size?: "sm" | "md";
}

export function CurrencyAmount({
  amount,
  currency = "PKR",
  className,
  primaryClassName,
  secondaryClassName,
  size = "md",
}: CurrencyAmountProps) {
  const pkr = toPKR(amount, currency);
  const clp = toCLP(amount, currency);
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  const primary =
    currency === "CLP"
      ? { value: clp, code: "CLP" as CurrencyCode }
      : { value: pkr, code: "PKR" as CurrencyCode };
  const secondary =
    currency === "CLP"
      ? { value: pkr, code: "PKR" as CurrencyCode }
      : { value: clp, code: "CLP" as CurrencyCode };

  return (
    <span className={cn("tabular-nums leading-snug", className)}>
      <span className={cn(textSize, "font-semibold text-foreground", primaryClassName)}>
        {formatMoney(primary.value, primary.code)}
      </span>
      <span className={cn(textSize, "text-muted-foreground", secondaryClassName)}>
        {" · "}
        {formatMoney(secondary.value, secondary.code)}
      </span>
    </span>
  );
}
