"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, BarChart3, Sun } from "lucide-react";

interface DashboardHeroProps {
  firstName: string;
  today: string;
}

export function DashboardHero({ firstName, today }: DashboardHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="welcome-strip soft-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 md:p-7"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md shadow-indigo-500/20">
          <Sun className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground md:text-base">{today}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Hello, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Use the menu on the left to open any section.
          </p>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto">
        <Link
          href="/dashboard/quick-add"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:flex-none md:text-base"
        >
          <Plus className="h-4 w-4" />
          Quick Add
        </Link>
        <Link
          href="/reports"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted/50 sm:flex-none md:text-base"
        >
          <BarChart3 className="h-4 w-4 text-indigo-500" />
          Reports
        </Link>
      </div>
    </motion.div>
  );
}
