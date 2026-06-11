import { DashboardSubNav } from "@/components/dashboard/dashboard-sub-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-1 sm:px-0">
      <div className="flex flex-col gap-5 md:flex-row md:gap-6 lg:gap-8">
        <DashboardSubNav />
        <div className="min-w-0 flex-1 pb-6 md:pb-8">{children}</div>
      </div>
    </div>
  );
}
