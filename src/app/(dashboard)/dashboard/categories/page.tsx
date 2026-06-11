import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getExpenseStats } from "@/lib/expense-service";

export default async function DashboardCategoriesPage() {
  const stats = await getExpenseStats();

  return (
    <div className="space-y-4">
      <SectionHeader title="Categories" description="Where your money went this month" />
      <CategoryBreakdown data={stats.categoryData} total={stats.totals.month} />
    </div>
  );
}
