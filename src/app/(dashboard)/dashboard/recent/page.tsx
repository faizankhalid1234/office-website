import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getExpenseStats } from "@/lib/expense-service";
import { requireUser } from "@/lib/require-user";

export default async function DashboardRecentPage() {
  const user = await requireUser();
  const stats = await getExpenseStats(user.id);

  return (
    <div className="space-y-4">
      <SectionHeader title="Recent Expenses" description="Your latest transactions" />
      <RecentExpenses expenses={stats.recentExpenses} />
    </div>
  );
}
