import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getExpenseStats } from "@/lib/expense-service";
import { requireUser } from "@/lib/require-user";
import Link from "next/link";
import { Wallet } from "lucide-react";

export default async function DashboardBudgetPage() {
  const user = await requireUser();
  const stats = await getExpenseStats(user.id);

  return (
    <div className="space-y-4">
      <SectionHeader title="Budget" description="Monthly spending limit" />
      {stats.budget ? (
        <BudgetProgress
          amount={stats.budget.amount}
          used={stats.budget.used}
          remaining={stats.budget.remaining}
          percentage={stats.budget.percentage}
        />
      ) : (
        <div className="soft-card flex flex-col items-center gap-3 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <p className="font-semibold text-foreground">No budget set</p>
          <p className="text-sm text-muted-foreground">Admin can set a monthly spending limit</p>
          <Link
            href="/budget"
            className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Set Budget
          </Link>
        </div>
      )}
    </div>
  );
}
