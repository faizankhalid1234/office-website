import { InsightCards } from "@/components/dashboard/insight-cards";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getExpenseStats } from "@/lib/expense-service";

export default async function DashboardInsightsPage() {
  const stats = await getExpenseStats();

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
