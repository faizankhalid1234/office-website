"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  highlight?: boolean;
  isActive: (pathname: string) => boolean;
};

const items: NavItem[] = [
  {
    href: "/dashboard",
    label: "Home",
    icon: LayoutDashboard,
    isActive: (p) => p === "/dashboard" || p.startsWith("/dashboard/"),
  },
  {
    href: "/expenses",
    label: "Expenses",
    icon: Receipt,
    isActive: (p) =>
      p === "/expenses" ||
      (p.startsWith("/expenses/") && !p.startsWith("/expenses/add")),
  },
  {
    href: "/expenses/add",
    label: "Add",
    icon: PlusCircle,
    highlight: true,
    isActive: (p) => p.startsWith("/expenses/add"),
  },
  {
    href: "/reports",
    label: "Reports",
    icon: FileBarChart,
    isActive: (p) => p.startsWith("/reports"),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/40 bg-white/95 shadow-[0_-8px_32px_-8px_rgba(99,102,241,0.15)] backdrop-blur-xl dark:bg-background/95 md:hidden"
      aria-label="Main navigation"
    >
      <div
        className="safe-px flex items-stretch justify-around gap-0.5 pt-1.5"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(pathname);

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center justify-end pb-0.5"
              >
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg shadow-indigo-500/40 transition-transform active:scale-95",
                    active
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600 ring-2 ring-indigo-300/50"
                      : "bg-gradient-to-br from-indigo-500 to-violet-600"
                  )}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.25} />
                </span>
                <span
                  className={cn(
                    "mt-1 text-[10px] font-semibold",
                    active ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 transition-colors active:scale-95",
                active
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                  active && "bg-indigo-100 dark:bg-indigo-500/15"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 2} />
              </span>
              <span className="text-[10px] font-semibold leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
