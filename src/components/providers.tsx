"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/components/currency/currency-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false} basePath="/api/auth">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <CurrencyProvider>
          {children}
          <Toaster richColors position="top-right" />
        </CurrencyProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
