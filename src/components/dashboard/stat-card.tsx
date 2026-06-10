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

const GLOW_MAP: Record<string, string> = {
  calendar: "stat-glow-blue",
  trending: "stat-glow-purple",
  wallet: "stat-glow-green",
  receipt: "stat-glow-orange",
};

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof ICONS;
  trend?: string;
  gradient?: string;
  index?: number;
}

export function StatCard({ title, value, icon, trend, gradient, index = 0 }: StatCardProps) {
  const Icon = ICONS[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div
        className={cn(
          "glass-card relative overflow-hidden p-5 transition-all duration-300 hover:shadow-2xl",
          GLOW_MAP[icon]
        )}
      >
        <div
          className={cn(
            "absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl",
            gradient ?? "bg-indigo-500"
          )}
        />
        <div className="relative flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-extrabold tracking-tight lg:text-3xl">
              {formatCurrency(value)}
            </p>
            {trend && (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{trend}</p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg",
              gradient ?? "bg-gradient-to-br from-indigo-500 to-violet-600"
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
