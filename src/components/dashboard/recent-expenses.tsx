"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Receipt, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils-format";
import { PAYMENT_METHODS } from "@/lib/constants";

interface RecentExpense {
  id: string;
  title: string;
  amount: number;
  date: Date | string;
  paymentMethod: string;
  category: { name: string; color: string };
  user: { name: string };
}

function paymentLabel(method: string) {
  return PAYMENT_METHODS.find((p) => p.value === method)?.label ?? method;
}

export function RecentExpenses({ expenses }: { expenses: RecentExpense[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div>
          <h3 className="text-base font-bold">Recent Transactions</h3>
          <p className="text-xs text-muted-foreground">Latest 8 expenses</p>
        </div>
        <Link
          href="/expenses"
          className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Receipt className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm font-medium">No expenses yet</p>
          <p className="text-xs mt-1">Add your first expense using Quick Add</p>
        </div>
      ) : (
        <div className="divide-y divide-border/30">
          {expenses.map((expense, i) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[1fr_auto] gap-3 px-5 py-3.5 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5 transition-colors"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: expense.category.color }}
                  />
                  <p className="font-semibold text-sm truncate">{expense.title}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pl-4">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                    {expense.category.name}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                    {paymentLabel(expense.paymentMethod)}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{formatDate(expense.date)}</span>
                </div>
                <div className="flex items-center gap-1 pl-4 text-[10px] text-muted-foreground">
                  <User className="h-3 w-3" />
                  {expense.user.name}
                </div>
              </div>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 self-center">
                {formatCurrency(expense.amount)}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
