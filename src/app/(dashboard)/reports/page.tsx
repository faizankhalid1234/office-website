import { ReportsView } from "@/components/reports/reports-view";
import { getMonthlyReport, getTrendData } from "@/lib/expense-service";

export default async function ReportsPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [report, trendData] = await Promise.all([
    getMonthlyReport(month, year),
    getTrendData(),
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
