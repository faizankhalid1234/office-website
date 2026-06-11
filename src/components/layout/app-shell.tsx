import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mesh-bg flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-x-hidden bg-background/50 p-3 text-foreground sm:p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
