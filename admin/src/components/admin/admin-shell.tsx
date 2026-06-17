"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Shield,
  LayoutDashboard,
  Users,
  Wallet,
  LogOut,
  ExternalLink,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_PATHS, APP_LINKS } from "@/lib/app-urls";
import { COMPANY_NAME } from "@/lib/constants";

const navItems = [
  { href: APP_PATHS.adminDashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: APP_PATHS.adminUsers, label: "Users", icon: Users },
  { href: APP_PATHS.adminBudget, label: "Budget", icon: Wallet },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === APP_PATHS.adminDashboard
            ? pathname === APP_PATHS.adminDashboard
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                : "text-violet-200/70 hover:bg-violet-500/10 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}

      <div className="my-4 border-t border-violet-500/15" />

      <Link
        href={APP_LINKS.websiteDashboard()}
        onClick={onNavigate}
        className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-violet-200/60 hover:bg-white/5 hover:text-violet-100"
      >
        <ExternalLink className="h-4 w-4 shrink-0" />
        Employee Website
      </Link>
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="admin-bg flex min-h-screen min-h-[100dvh]">
      <aside className="admin-sidebar-gradient hidden w-64 shrink-0 flex-col md:flex">
        <div className="border-b border-violet-500/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/30 ring-1 ring-violet-400/20">
              <Shield className="h-5 w-5 text-violet-200" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300/70">
                Admin Site
              </p>
              <p className="text-sm font-bold text-white">{COMPANY_NAME}</p>
            </div>
          </div>
        </div>
        <SidebarNav />
        <div className="border-t border-violet-500/10 p-4">
          <p className="mb-2 truncate text-xs text-violet-200/50">{session?.user?.email}</p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-violet-200/70 hover:bg-violet-500/10 hover:text-white"
            onClick={() => signOut({ callbackUrl: APP_PATHS.adminLogin })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-violet-500/10 bg-black/20 px-4 md:hidden">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet-400" />
            <span className="text-sm font-bold text-white">Admin Panel</span>
          </div>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-violet-200 hover:bg-violet-500/10"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="admin-sidebar-gradient border-violet-500/20 p-0 w-72"
            >
              <div className="border-b border-violet-500/10 p-5">
                <p className="text-sm font-bold text-white">Admin Control Center</p>
              </div>
              <SidebarNav onNavigate={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
