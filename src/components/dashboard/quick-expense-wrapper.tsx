import { QuickExpense } from "@/components/expenses/quick-expense";
import { prisma } from "@/lib/prisma";

export async function QuickExpenseWrapper({ compact }: { compact?: boolean }) {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return <QuickExpense categories={categories} compact={compact} />;
}
