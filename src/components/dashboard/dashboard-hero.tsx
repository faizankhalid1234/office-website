"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, BarChart3 } from "lucide-react";
import { CompanyLogoMark } from "@/components/brand/company-logo";

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
      className="welcome-strip soft-card flex flex-col gap-4 p-4 sm:gap-5 sm:p-5 md:flex-row md:items-center md:justify-between md:p-6 lg:p-7"
    >
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <CompanyLogoMark size="lg" className="sm:h-14 sm:w-14" />
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground sm:text-sm md:text-base">{today}</p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl lg:text-4xl">
            Hello, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm md:text-base">
            Use the menu to open any section.
          </p>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-2 min-[400px]:flex-row sm:w-auto">
        <Link
          href="/dashboard/quick-add"
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:flex-none sm:px-5 md:text-base"
        >
          <Plus className="h-4 w-4 shrink-0" />
          Quick Add
        </Link>
        <Link
          href="/reports"
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted/50 sm:flex-none sm:px-5 md:text-base"
        >
          <BarChart3 className="h-4 w-4 shrink-0 text-primary" />
          Reports
        </Link>
      </div>
    </motion.div>
  );
}
