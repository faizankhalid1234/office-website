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

  return (
    <span className={cn("tabular-nums leading-snug", className)}>
      <span className={cn(textSize, "font-semibold text-foreground", primaryClassName)}>
        {formatMoney(pkr, "PKR")}
      </span>
      <span className={cn(textSize, "text-muted-foreground", secondaryClassName)}>
        {" · "}
        {formatMoney(clp, "CLP")}
      </span>
    </span>
  );
}
