"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getBudgetAlertLevel } from "@/lib/utils-format";
import { CurrencyAmount } from "@/components/currency/currency-amount";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  amount: number;
  used: number;
  remaining: number;
  percentage: number;
}

export function BudgetProgress({ amount, used, remaining, percentage }: BudgetProgressProps) {
  const level = getBudgetAlertLevel(percentage);
  const clampedPct = Math.min(percentage, 100);

  const alertMessages = {
    normal: null,
    warning: "80% of budget used",
    danger: "90% of budget used",
    exceeded: "Budget exceeded!",
  };

  const message = alertMessages[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="soft-card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/20">
            <Wallet className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Monthly Budget</h3>
            <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}% used</p>
          </div>
        </div>
        <Link
          href="/budget"
          className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Manage
        </Link>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-1 gap-2 text-center min-[400px]:grid-cols-3 sm:gap-3">
          <div className="rounded-2xl bg-muted/40 px-2 py-3">
            <p className="text-[10px] text-muted-foreground">Budget</p>
            <p className="mt-0.5">
              <CurrencyAmount amount={amount} currency="PKR" size="sm" />
            </p>
          </div>
          <div className="rounded-2xl bg-orange-50 px-2 py-3 dark:bg-orange-500/10">
            <p className="text-[10px] text-muted-foreground">Spent</p>
            <p className="mt-0.5">
              <CurrencyAmount
                amount={used}
                currency="PKR"
                size="sm"
                primaryClassName="text-orange-600 dark:text-orange-400"
              />
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-2 py-3 dark:bg-emerald-500/10">
            <p className="text-[10px] text-muted-foreground">Left</p>
            <p className="mt-0.5">
              <CurrencyAmount
                amount={remaining}
                currency="PKR"
                size="sm"
                primaryClassName="text-emerald-600 dark:text-emerald-400"
              />
            </p>
          </div>
        </div>

        <Progress
          value={clampedPct}
          className={cn(
            "h-2 rounded-full",
            level === "exceeded" && "[&>div]:bg-red-500",
            level === "danger" && "[&>div]:bg-orange-500",
            level === "warning" && "[&>div]:bg-yellow-500"
          )}
        />

        {message && level !== "normal" && (
          <Alert
            className={cn(
              "rounded-xl py-2",
              level === "exceeded" && "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400",
              level === "danger" && "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400",
              level === "warning" && "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400"
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <AlertDescription className="text-xs">{message}</AlertDescription>
          </Alert>
        )}
      </div>
    </motion.div>
  );
}
