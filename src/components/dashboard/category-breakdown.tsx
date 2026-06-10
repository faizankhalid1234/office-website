"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils-format";

interface CategoryItem {
  name: string;
  value: number;
  color: string;
}

export function CategoryBreakdown({ data, total }: { data: CategoryItem[]; total: number }) {
  if (!data.length) {
    return (
      <div className="glass-card flex h-48 items-center justify-center text-sm text-muted-foreground">
        No category expenses this month
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-border/50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Category</span>
        <span className="text-right">Amount</span>
        <span className="text-right w-14">Share</span>
      </div>
      <div className="divide-y divide-border/30">
        {data.map((cat, i) => {
          const pct = total > 0 ? (cat.value / total) * 100 : 0;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 px-5 py-3.5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-3 w-3 rounded-full shrink-0 ring-2 ring-white dark:ring-background"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm font-medium truncate">{cat.name}</span>
              </div>
              <span className="text-sm font-bold text-right">{formatCurrency(cat.value)}</span>
              <div className="w-14 text-right">
                <span className="text-xs font-semibold text-muted-foreground">{pct.toFixed(0)}%</span>
                <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
