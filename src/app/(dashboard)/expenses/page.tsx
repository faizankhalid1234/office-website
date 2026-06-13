import { ExpensesList } from "@/components/expenses/expenses-list";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { decimalToNumber } from "@/lib/utils-format";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ExpensesPage() {
  const user = await requireUser();

  const [expenses, categories] = await Promise.all([
    prisma.expense.findMany({
      where: { userId: user.id },
      include: { category: true, user: { select: { name: true } } },
      orderBy: { date: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track all office expenses
          </p>
        </div>
        <Link
          href="/expenses/add"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 sm:w-auto sm:px-5"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </Link>
      </div>

      <ExpensesList
        expenses={expenses.map((e) => ({
          ...e,
          amount: decimalToNumber(e.amount),
          currency: e.currency,
        }))}
        categories={categories}
      />
    </div>
  );
}
