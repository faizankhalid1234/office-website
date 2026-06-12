import { ReportsView } from "@/components/reports/reports-view";
import { getMonthlyReport, getTrendData } from "@/lib/expense-service";
import { requireUser } from "@/lib/require-user";

export default async function ReportsPage() {
  const user = await requireUser();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [report, trendData] = await Promise.all([
    getMonthlyReport(user.id, month, year),
    getTrendData(user.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monthly expense reports and analytics
        </p>
      </div>
      <ReportsView
        initialReport={report}
        trendData={trendData}
        initialMonth={month}
        initialYear={year}
      />
    </div>
  );
}
