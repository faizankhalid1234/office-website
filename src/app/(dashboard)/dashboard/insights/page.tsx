import { InsightCards } from "@/components/dashboard/insight-cards";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getExpenseStats } from "@/lib/expense-service";
import { requireUser } from "@/lib/require-user";

export default async function DashboardInsightsPage() {
  const user = await requireUser();
  const stats = await getExpenseStats(user.id);

  return (
    <div className="space-y-4">
      <SectionHeader title="Insights" description="Key highlights at a glance" />
      <InsightCards
        monthCount={stats.monthCount}
        highestCategory={stats.highestCategory}
        monthTotal={stats.totals.month}
        lastMonthTotal={stats.lastMonthTotal}
        budgetRemaining={stats.budget?.remaining ?? null}
      />
    </div>
  );
}
