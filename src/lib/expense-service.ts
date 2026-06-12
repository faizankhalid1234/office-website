import { prisma } from "@/lib/prisma";
import { decimalToNumber, getDateRanges } from "@/lib/utils-format";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  eachMonthOfInterval,
  subYears,
} from "date-fns";
import type { Prisma } from "@/generated/prisma/client";

function withUser(userId: string, where: Prisma.ExpenseWhereInput = {}) {
  return { ...where, userId };
}

export async function getExpenseStats(userId: string) {
  const ranges = getDateRanges();

  const [today, week, month, year, recentExpenses, categoryBreakdown, monthlyData, budget, lastMonthTotal, monthCount] =
    await Promise.all([
      prisma.expense.aggregate({
        where: withUser(userId, { date: { gte: ranges.today } }),
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: withUser(userId, { date: { gte: ranges.week } }),
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: withUser(userId, { date: { gte: ranges.month } }),
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: withUser(userId, { date: { gte: ranges.year } }),
        _sum: { amount: true },
      }),
      prisma.expense.findMany({
        where: { userId },
        take: 8,
        orderBy: { date: "desc" },
        include: { category: true, user: { select: { name: true } } },
      }),
      prisma.expense.groupBy({
        by: ["categoryId"],
        where: withUser(userId, { date: { gte: ranges.month } }),
        _sum: { amount: true },
      }),
      getMonthlyExpenseData(userId),
      getCurrentBudget(),
      prisma.expense.aggregate({
        where: withUser(userId, {
          date: {
            gte: ranges.lastMonth,
            lt: ranges.lastMonthEnd,
          },
        }),
        _sum: { amount: true },
      }),
      prisma.expense.count({
        where: withUser(userId, { date: { gte: ranges.month } }),
      }),
    ]);

  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const categoryData = categoryBreakdown
    .map((item) => {
      const cat = categoryMap.get(item.categoryId);
      return {
        name: cat?.name ?? "Unknown",
        value: decimalToNumber(item._sum.amount ?? 0),
        color: cat?.color ?? "#6366f1",
      };
    })
    .sort((a, b) => b.value - a.value);

  const monthTotal = decimalToNumber(month._sum.amount ?? 0);
  const budgetAmount = budget ? decimalToNumber(budget.amount) : 0;
  const budgetUsed = budgetAmount > 0 ? (monthTotal / budgetAmount) * 100 : 0;

  return {
    totals: {
      today: decimalToNumber(today._sum.amount ?? 0),
      week: decimalToNumber(week._sum.amount ?? 0),
      month: monthTotal,
      year: decimalToNumber(year._sum.amount ?? 0),
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
    lastMonthTotal: decimalToNumber(lastMonthTotal._sum.amount ?? 0),
    monthCount,
    highestCategory: categoryData[0] ?? null,
  };
}

async function getMonthlyExpenseData(userId: string) {
  const end = new Date();
  const start = subYears(end, 1);
  const months = eachMonthOfInterval({ start, end });

  const expenses = await prisma.expense.groupBy({
    by: ["date"],
    where: withUser(userId, { date: { gte: start } }),
    _sum: { amount: true },
  });

  const monthTotals = new Map<string, number>();
  for (const exp of expenses) {
    const key = format(exp.date, "MMM yyyy");
    monthTotals.set(key, (monthTotals.get(key) ?? 0) + decimalToNumber(exp._sum.amount ?? 0));
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

  const [expenses, prevTotal, categories] = await Promise.all([
    prisma.expense.findMany({
      where: withUser(userId, { date: { gte: start, lte: end } }),
      include: { category: true },
      orderBy: { date: "desc" },
    }),
    prisma.expense.aggregate({
      where: withUser(userId, { date: { gte: prevStart, lte: prevEnd } }),
      _sum: { amount: true },
    }),
    prisma.category.findMany(),
  ]);

  const categoryTotals = new Map<string, { name: string; color: string; total: number }>();
  let total = 0;

  for (const exp of expenses) {
    const amount = decimalToNumber(exp.amount);
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
  const prevMonthTotal = decimalToNumber(prevTotal._sum.amount ?? 0);
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
    select: { date: true, amount: true },
    orderBy: { date: "asc" },
  });

  const dailyMap = new Map<string, number>();
  for (const exp of expenses) {
    const key = format(exp.date, "yyyy-MM-dd");
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + decimalToNumber(exp.amount));
  }

  return Array.from(dailyMap.entries())
    .map(([date, amount]) => ({ date, amount }))
    .slice(-30);
}
