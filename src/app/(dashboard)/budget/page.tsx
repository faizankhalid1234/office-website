import { BudgetManager } from "@/components/budget/budget-manager";
import { getCurrentBudget } from "@/lib/expense-service";
import { requireUser } from "@/lib/require-user";
import { prisma } from "@/lib/prisma";
import { decimalToNumber, expenseAmountInPKR } from "@/lib/utils-format";
import { startOfMonth, endOfMonth } from "date-fns";

export default async function BudgetPage() {
  const user = await requireUser();
  const now = new Date();
  const budget = await getCurrentBudget();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const monthExpenses = await prisma.expense.findMany({
    where: { userId: user.id, date: { gte: start, lte: end } },
    select: { amount: true, currency: true },
  });

  const budgetAmountPKR = budget
    ? expenseAmountInPKR(decimalToNumber(budget.amount), budget.currency)
    : 0;
  const used = monthExpenses.reduce(
    (sum, e) => sum + expenseAmountInPKR(decimalToNumber(e.amount), e.currency),
    0
  );

  const amount = budget ? decimalToNumber(budget.amount) : 0;

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
          remaining: Math.max(0, budgetAmountPKR - used),
          percentage: budgetAmountPKR > 0 ? (used / budgetAmountPKR) * 100 : 0,
        }}
        history={allBudgets.map((b) => ({
          ...b,
          amount: decimalToNumber(b.amount),
          currency: b.currency,
        }))}
      />
    </div>
  );
}
