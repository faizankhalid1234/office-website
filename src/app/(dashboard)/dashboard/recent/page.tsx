import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getExpenseStats } from "@/lib/expense-service";

export default async function DashboardRecentPage() {
  const stats = await getExpenseStats();

  return (
    <div className="space-y-4">
      <SectionHeader title="Recent Expenses" description="Your latest transactions" />
      <RecentExpenses expenses={stats.recentExpenses} />
    </div>
  );
}
