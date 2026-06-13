import { notFound } from "next/navigation";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { decimalToNumber } from "@/lib/utils-format";

type Params = { params: Promise<{ id: string }> };

export default async function EditExpensePage({ params }: Params) {
  const user = await requireUser();
  const { id } = await params;

  const [expense, categories] = await Promise.all([
    prisma.expense.findFirst({ where: { id, userId: user.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!expense) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Expense</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update expense details
        </p>
      </div>
      <ExpenseForm
        categories={categories}
        initialData={{
          id: expense.id,
          title: expense.title,
          amount: decimalToNumber(expense.amount),
          date: expense.date.toISOString(),
          paymentMethod: expense.paymentMethod,
          description: expense.description,
          categoryId: expense.categoryId,
          currency: expense.currency,
          receiptUrl: expense.receiptUrl,
          receiptName: expense.receiptName,
        }}
      />
    </div>
  );
}
