import { prisma } from "@/lib/prisma";
import { decimalToNumber, expenseAmountInPKR } from "@/lib/utils-format";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  eachMonthOfInterval,
  subYears,
} from "date-fns";
import type { Prisma } from "@/generated/prisma/client";
import { getDateRanges } from "@/lib/utils-format";

function withUser(userId: string, where: Prisma.ExpenseWhereInput = {}) {
  return { ...where, userId };
}

function sumExpensesInPKR(
  expenses: Array<{ amount: unknown; currency: string }>
): number {
  return expenses.reduce(
    (sum, e) =>
      sum +
      expenseAmountInPKR(
        decimalToNumber(e.amount as { toNumber?: () => number } | number),
        e.currency
      ),
    0
  );
}

async function aggregateSumPKR(userId: string, where: Prisma.ExpenseWhereInput = {}) {
  const expenses = await prisma.expense.findMany({
    where: withUser(userId, where),
    select: { amount: true, currency: true },
  });
  return sumExpensesInPKR(expenses);
}

export async function getExpenseStats(userId: string) {
  const ranges = getDateRanges();

  const [todaySum, weekSum, monthSum, yearSum, recentExpenses, monthExpenses, monthlyData, budget, lastMonthExpenses, monthCount] =
    await Promise.all([
      aggregateSumPKR(userId, { date: { gte: ranges.today } }),
      aggregateSumPKR(userId, { date: { gte: ranges.week } }),
      aggregateSumPKR(userId, { date: { gte: ranges.month } }),
      aggregateSumPKR(userId, { date: { gte: ranges.year } }),
      prisma.expense.findMany({
        where: { userId },
        take: 8,
        orderBy: { date: "desc" },
        include: { category: true, user: { select: { name: true } } },
      }),
      prisma.expense.findMany({
        where: withUser(userId, { date: { gte: ranges.month } }),
        select: { categoryId: true, amount: true, currency: true },
      }),
      getMonthlyExpenseData(userId),
      getCurrentBudget(),
      prisma.expense.findMany({
        where: withUser(userId, {
          date: {
            gte: ranges.lastMonth,
            lt: ranges.lastMonthEnd,
          },
        }),
        select: { amount: true, currency: true },
      }),
      prisma.expense.count({
        where: withUser(userId, { date: { gte: ranges.month } }),
      }),
    ]);

  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const categoryTotals = new Map<string, number>();
  for (const item of monthExpenses) {
    const pkr = expenseAmountInPKR(decimalToNumber(item.amount), item.currency);
    categoryTotals.set(
      item.categoryId,
      (categoryTotals.get(item.categoryId) ?? 0) + pkr
    );
  }

  const categoryData = Array.from(categoryTotals.entries())
    .map(([categoryId, value]) => {
      const cat = categoryMap.get(categoryId);
      return {
        name: cat?.name ?? "Unknown",
        value,
        color: cat?.color ?? "#6366f1",
      };
    })
    .sort((a, b) => b.value - a.value);

  const monthTotal = monthSum;
  const budgetAmount = budget
    ? expenseAmountInPKR(decimalToNumber(budget.amount), budget.currency)
    : 0;
  const budgetUsed = budgetAmount > 0 ? (monthTotal / budgetAmount) * 100 : 0;

  return {
    totals: {
      today: todaySum,
      week: weekSum,
      month: monthTotal,
      year: yearSum,
    },
    recentExpenses: recentExpenses.map((e) => ({
      ...e,
      amount: decimalToNumber(e.amount),
    })),
    categoryData,
    monthlyData,
    budget: budget
      ? {
          amount: budgetAmount,
          used: monthTotal,
          remaining: Math.max(0, budgetAmount - monthTotal),
          percentage: budgetUsed,
        }
      : null,
    lastMonthTotal: sumExpensesInPKR(lastMonthExpenses),
    monthCount,
    highestCategory: categoryData[0] ?? null,
  };
}

async function getMonthlyExpenseData(userId: string) {
  const end = new Date();
  const start = subYears(end, 1);
  const months = eachMonthOfInterval({ start, end });

  const expenses = await prisma.expense.findMany({
    where: withUser(userId, { date: { gte: start } }),
    select: { date: true, amount: true, currency: true },
    orderBy: { date: "asc" },
  });

  const monthTotals = new Map<string, number>();
  for (const exp of expenses) {
    const key = format(exp.date, "MMM yyyy");
    const pkr = expenseAmountInPKR(decimalToNumber(exp.amount), exp.currency);
    monthTotals.set(key, (monthTotals.get(key) ?? 0) + pkr);
  }

  return months.map((m) => ({
    month: format(m, "MMM"),
    amount: monthTotals.get(format(m, "MMM yyyy")) ?? 0,
  }));
}

export async function getCurrentBudget() {
  const now = new Date();
  return prisma.budget.findUnique({
    where: {
      month_year: { month: now.getMonth() + 1, year: now.getFullYear() },
    },
  });
}

export async function getMonthlyReport(userId: string, month: number, year: number) {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(start);
  const prevStart = startOfMonth(subMonths(start, 1));
  const prevEnd = endOfMonth(prevStart);

  const [expenses, prevExpenses, categories] = await Promise.all([
    prisma.expense.findMany({
      where: withUser(userId, { date: { gte: start, lte: end } }),
      include: { category: true },
      orderBy: { date: "desc" },
    }),
    prisma.expense.findMany({
      where: withUser(userId, { date: { gte: prevStart, lte: prevEnd } }),
      select: { amount: true, currency: true },
    }),
    prisma.category.findMany(),
  ]);

  const categoryTotals = new Map<string, { name: string; color: string; total: number }>();
  let total = 0;

  for (const exp of expenses) {
    const amount = expenseAmountInPKR(decimalToNumber(exp.amount), exp.currency);
    total += amount;
    const existing = categoryTotals.get(exp.categoryId) ?? {
      name: exp.category.name,
      color: exp.category.color,
      total: 0,
    };
    existing.total += amount;
    categoryTotals.set(exp.categoryId, existing);
  }

  const breakdown = Array.from(categoryTotals.values()).sort((a, b) => b.total - a.total);
  const highest = breakdown[0] ?? null;
  const prevMonthTotal = sumExpensesInPKR(prevExpenses);
  const comparison =
    prevMonthTotal > 0 ? ((total - prevMonthTotal) / prevMonthTotal) * 100 : total > 0 ? 100 : 0;

  return {
    month,
    year,
    total,
    expenses: expenses.map((e) => ({ ...e, amount: decimalToNumber(e.amount) })),
    breakdown,
    highest,
    prevMonthTotal,
    comparison,
    categories,
  };
}

export async function getTrendData(userId: string) {
  const end = new Date();
  const start = subYears(end, 1);

  const expenses = await prisma.expense.findMany({
    where: withUser(userId, { date: { gte: start } }),
    select: { date: true, amount: true, currency: true },
    orderBy: { date: "asc" },
  });

  const dailyMap = new Map<string, number>();
  for (const exp of expenses) {
    const key = format(exp.date, "yyyy-MM-dd");
    const pkr = expenseAmountInPKR(decimalToNumber(exp.amount), exp.currency);
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + pkr);
  }

  return Array.from(dailyMap.entries())
    .map(([date, amount]) => ({ date, amount }))
    .slice(-30);
}
