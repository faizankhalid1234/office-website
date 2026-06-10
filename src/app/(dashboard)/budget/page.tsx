import { BudgetManager } from "@/components/budget/budget-manager";
import { getCurrentBudget } from "@/lib/expense-service";
import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/utils-format";
import { startOfMonth, endOfMonth } from "date-fns";

export default async function BudgetPage() {
  const now = new Date();
  const budget = await getCurrentBudget();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const spent = await prisma.expense.aggregate({
    where: { date: { gte: start, lte: end } },
    _sum: { amount: true },
  });

  const amount = budget ? decimalToNumber(budget.amount) : 0;
  const used = decimalToNumber(spent._sum.amount ?? 0);

  const allBudgets = await prisma.budget.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 12,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Budget</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Set and monitor monthly budgets
        </p>
      </div>
      <BudgetManager
        current={{
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          amount,
          used,
          remaining: Math.max(0, amount - used),
          percentage: amount > 0 ? (used / amount) * 100 : 0,
        }}
        history={allBudgets.map((b) => ({
          ...b,
          amount: decimalToNumber(b.amount),
        }))}
      />
    </div>
  );
}
