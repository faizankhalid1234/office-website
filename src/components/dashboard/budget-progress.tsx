"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, CheckCircle, XCircle, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrency, getBudgetAlertLevel } from "@/lib/utils-format";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  amount: number;
  used: number;
  remaining: number;
  percentage: number;
}

export function BudgetProgress({ amount, used, remaining, percentage }: BudgetProgressProps) {
  const level = getBudgetAlertLevel(percentage);

  const alertConfig = {
    normal: null,
    warning: {
      icon: AlertTriangle,
      message: "80% of monthly budget used",
      className: "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    },
    danger: {
      icon: AlertTriangle,
      message: "90% of budget reached — be careful!",
      className: "border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400",
    },
    exceeded: {
      icon: XCircle,
      message: "Budget exceeded! Review spending.",
      className: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400",
    },
  };

  const alert = alertConfig[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              Monthly Budget
              {level === "normal" && percentage > 0 && (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              )}
            </h3>
            <p className="text-xs text-muted-foreground">Current month spending limit</p>
          </div>
        </div>
        <Link href="/budget" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Manage
        </Link>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-indigo-50/80 p-3 text-center dark:bg-indigo-500/10">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Budget</p>
            <p className="text-sm font-bold mt-1">{formatCurrency(amount)}</p>
          </div>
          <div className="rounded-xl bg-orange-50/80 p-3 text-center dark:bg-orange-500/10">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Spent</p>
            <p className="text-sm font-bold mt-1 text-orange-600 dark:text-orange-400">{formatCurrency(used)}</p>
          </div>
          <div className="rounded-xl bg-emerald-50/80 p-3 text-center dark:bg-emerald-500/10">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Left</p>
            <p className="text-sm font-bold mt-1 text-emerald-600 dark:text-emerald-400">{formatCurrency(remaining)}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-bold">{percentage.toFixed(1)}% used</span>
          </div>
          <Progress
            value={Math.min(percentage, 100)}
            className={cn(
              "h-3 rounded-full",
              level === "exceeded" && "[&>div]:bg-red-500",
              level === "danger" && "[&>div]:bg-orange-500",
              level === "warning" && "[&>div]:bg-yellow-500"
            )}
          />
        </div>

        {alert && (
          <Alert className={cn("rounded-xl", alert.className)}>
            <alert.icon className="h-4 w-4" />
            <AlertDescription className="text-xs">{alert.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </motion.div>
  );
}
