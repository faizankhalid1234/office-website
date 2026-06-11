"use client";

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, Menu, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { COMPANY_NAME } from "@/lib/constants";
import { format } from "date-fns";

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const today = format(new Date(), "EEEE, MMM d");

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-white/70 backdrop-blur-2xl dark:bg-background/70">
      <div className="flex h-[68px] items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <Sheet>
            <SheetTrigger
              className="inline-flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-0 bg-transparent p-0 text-white">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <span className="font-bold text-sm gradient-text">{COMPANY_NAME}</span>
        </div>

        <div className="hidden lg:block">
          <p className="text-xs text-muted-foreground">{today}</p>
          <p className="text-base font-semibold text-foreground">
            Hello, <span className="gradient-text">{session?.user?.name?.split(" ")[0]}</span> 👋
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 text-amber-500 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 text-indigo-400 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none ring-2 ring-transparent transition-all hover:ring-indigo-200 focus-visible:ring-indigo-400 dark:hover:ring-indigo-500/30">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1 py-1">
                    <span className="font-semibold">{session?.user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {session?.user?.email}
                    </span>
                    <Badge className="w-fit mt-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {session?.user?.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled className="rounded-xl">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl text-red-600 focus:text-red-600"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
