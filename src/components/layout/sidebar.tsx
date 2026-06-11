"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Building2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY_NAME } from "@/lib/constants";
import { navItems } from "@/lib/nav-items";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const filteredItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="sidebar-gradient hidden w-[270px] shrink-0 flex-col border-r border-white/10 text-white lg:flex">
      <div className="flex h-[72px] items-center gap-3 px-6">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/40">
          <Building2 className="h-5 w-5 text-white" />
          <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-950" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-white">{COMPANY_NAME}</p>
          <p className="text-[11px] text-white/60">Expense Manager</p>
        </div>
      </div>

      <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>Smart expense tracking</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard" || pathname.startsWith("/dashboard/")
              : pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 md:text-base",
                isActive
                  ? "bg-gradient-to-r from-indigo-500/90 to-violet-500/90 text-white shadow-lg shadow-indigo-500/30"
                  : "text-white/70 hover:bg-white/8 hover:text-white",
                "highlight" in item && item.highlight && !isActive && "border border-dashed border-indigo-400/30"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "drop-shadow-sm")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 p-4 border border-white/10">
          <p className="text-xs font-medium text-white">{session?.user?.name ?? "User"}</p>
          <p className="text-[10px] text-white/50 mt-0.5 truncate">{session?.user?.email}</p>
          <span className="mt-2 inline-block rounded-full bg-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-white/90">
            {session?.user?.role ?? "EMPLOYEE"}
          </span>
        </div>
      </div>
    </aside>
  );
}
