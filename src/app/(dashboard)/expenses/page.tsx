import { ExpensesList } from "@/components/expenses/expenses-list";
import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/utils-format";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ExpensesPage() {
  const [expenses, categories] = await Promise.all([
    prisma.expense.findMany({
      include: { category: true, user: { select: { name: true } } },
      orderBy: { date: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track all office expenses
          </p>
        </div>
        <Link
          href="/expenses/add"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </Link>
      </div>

      <ExpensesList
        expenses={expenses.map((e) => ({
          ...e,
          amount: decimalToNumber(e.amount),
        }))}
        categories={categories}
      />
    </div>
  );
}
