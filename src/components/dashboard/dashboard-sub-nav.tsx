"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardNavItems } from "@/lib/dashboard-nav-items";

function isNavActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

export function DashboardSubNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 lg:block lg:w-64">
        <div className="soft-card sticky top-[76px] overflow-hidden p-3 lg:top-[84px]">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Menu
          </p>
          <nav className="space-y-1">
            {dashboardNavItems.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-start gap-3 rounded-xl px-3 py-3 transition-all",
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-foreground hover:bg-muted/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "mt-0.5 h-5 w-5 shrink-0",
                      active ? "text-white" : "text-indigo-500"
                    )}
                  />
                  <div className="min-w-0">
                    <p className={cn("text-sm font-semibold md:text-base", active && "text-white")}>
                      {item.label}
                    </p>
                    <p
                      className={cn(
                        "text-xs md:text-sm",
                        active ? "text-white/80" : "text-muted-foreground"
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile & tablet horizontal nav */}
      <nav className="soft-card -mx-1 flex gap-2 overflow-x-auto p-2 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1 rounded-xl px-4 py-2.5 min-w-[72px] transition-all",
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-muted/30 text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
