import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getExpenseStats } from "@/lib/expense-service";
import { requireUser } from "@/lib/require-user";

export default async function DashboardCategoriesPage() {
  const user = await requireUser();
  const stats = await getExpenseStats(user.id);

  return (
    <div className="space-y-4">
      <SectionHeader title="Categories" description="Where your money went this month" />
      <CategoryBreakdown data={stats.categoryData} total={stats.totals.month} />
    </div>
  );
}
