"use client";

import { motion } from "framer-motion";
import { Award, ArrowUpRight, ArrowDownRight, Hash, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils-format";

interface InsightCardsProps {
  monthCount: number;
  highestCategory: { name: string; value: number; color: string } | null;
  monthTotal: number;
  lastMonthTotal: number;
  budgetRemaining: number | null;
}

export function InsightCards({
  monthCount,
  highestCategory,
  monthTotal,
  lastMonthTotal,
  budgetRemaining,
}: InsightCardsProps) {
  const comparison =
    lastMonthTotal > 0 ? ((monthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;
  const isUp = comparison >= 0;

  const items = [
    {
      label: "Transactions",
      value: monthCount.toString(),
      sub: "This month",
      icon: Hash,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Top Category",
      value: highestCategory?.name ?? "—",
      sub: highestCategory ? formatCurrency(highestCategory.value) : "No data",
      icon: Award,
      color: "from-violet-500 to-purple-500",
      dot: highestCategory?.color,
    },
    {
      label: "vs Last Month",
      value: `${isUp ? "+" : ""}${comparison.toFixed(1)}%`,
      sub: `Prev: ${formatCurrency(lastMonthTotal)}`,
      icon: isUp ? ArrowUpRight : ArrowDownRight,
      color: isUp ? "from-orange-500 to-red-500" : "from-emerald-500 to-teal-500",
    },
    {
      label: "Budget Left",
      value: budgetRemaining !== null ? formatCurrency(budgetRemaining) : "—",
      sub: budgetRemaining !== null ? "Remaining this month" : "Not set",
      icon: Wallet,
      color: "from-indigo-500 to-violet-500",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="glass-card flex items-center gap-4 p-4"
        >
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-md`}>
            <item.icon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {item.label}
            </p>
            <p className="flex items-center gap-1.5 text-sm font-bold truncate">
              {"dot" in item && item.dot && (
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.dot }} />
              )}
              {item.value}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">{item.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
