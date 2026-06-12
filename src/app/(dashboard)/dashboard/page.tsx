import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { getExpenseStats } from "@/lib/expense-service";
import { auth } from "@/auth";
import { format } from "date-fns";

export default async function DashboardOverviewPage() {
  const [stats, session] = await Promise.all([getExpenseStats(), auth()]);

  const monthChange =
    stats.lastMonthTotal > 0
      ? ((stats.totals.month - stats.lastMonthTotal) / stats.lastMonthTotal) * 100
      : 0;

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6 md:space-y-8">
      <DashboardHero firstName={firstName} today={today} />

      <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard title="Today" value={stats.totals.today} icon="calendar" index={0} />
        <StatCard title="This Week" value={stats.totals.week} icon="trending" index={1} />
        <StatCard
          title="This Month"
          value={stats.totals.month}
          icon="wallet"
          trend={`${monthChange >= 0 ? "+" : ""}${monthChange.toFixed(1)}%`}
          index={2}
        />
        <StatCard title="This Year" value={stats.totals.year} icon="receipt" index={3} />
      </div>
    </div>
  );
}
