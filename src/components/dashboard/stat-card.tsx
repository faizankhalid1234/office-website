"use client";

import { motion } from "framer-motion";
import { Calendar, TrendingUp, Wallet, Receipt, LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils-format";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  calendar: Calendar,
  trending: TrendingUp,
  wallet: Wallet,
  receipt: Receipt,
};

const STYLES: Record<string, { bg: string; icon: string; accent: string }> = {
  calendar: {
    bg: "bg-sky-50 dark:bg-sky-500/10",
    icon: "bg-sky-500 text-white",
    accent: "border-sky-200 dark:border-sky-500/20",
  },
  trending: {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    icon: "bg-violet-500 text-white",
    accent: "border-violet-200 dark:border-violet-500/20",
  },
  wallet: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    icon: "bg-emerald-500 text-white",
    accent: "border-emerald-200 dark:border-emerald-500/20",
  },
  receipt: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    icon: "bg-amber-500 text-white",
    accent: "border-amber-200 dark:border-amber-500/20",
  },
};

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof ICONS;
  trend?: string;
  index?: number;
}

export function StatCard({ title, value, icon, trend, index = 0 }: StatCardProps) {
  const Icon = ICONS[icon];
  const style = STYLES[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      className={cn("soft-card border p-5", style.accent, style.bg)}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl shadow-sm",
            style.icon
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground md:text-base">{title}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground tabular-nums md:text-3xl">
        {formatCurrency(value)}
      </p>
    </motion.div>
  );
}
