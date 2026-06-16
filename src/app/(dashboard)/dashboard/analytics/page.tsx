import { CategoryPieChart, MonthlyBarChart } from "@/components/dashboard/charts";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getExpenseStats } from "@/lib/expense-service";
import { requireUser } from "@/lib/require-user";
import Link from "next/link";

export default async function DashboardAnalyticsPage() {
  const user = await requireUser();
  const stats = await getExpenseStats(user.id);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics"
        description="Monthly trends and category distribution"
        action={
          <Link
            href="/reports"
            className="text-xs font-medium text-primary hover:underline"
          >
            Full Reports →
          </Link>
        }
      />
      <MonthlyBarChart data={stats.monthlyData} />
      <CategoryPieChart data={stats.categoryData} />
    </div>
  );
}
