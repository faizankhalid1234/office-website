import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { budgetSchema } from "@/lib/validations";
import { decimalToNumber } from "@/lib/utils-format";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const budget = await prisma.budget.findUnique({
    where: { month_year: { month, year } },
  });

  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const spent = await prisma.expense.aggregate({
    where: { userId: session.user.id, date: { gte: start, lte: end } },
    _sum: { amount: true },
  });

  const amount = budget ? decimalToNumber(budget.amount) : 0;
  const used = decimalToNumber(spent._sum.amount ?? 0);

  return NextResponse.json({
    budget: budget ? { ...budget, amount } : null,
    used,
    remaining: Math.max(0, amount - used),
    percentage: amount > 0 ? (used / amount) * 100 : 0,
    month,
    year,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = budgetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.upsert({
      where: {
        month_year: { month: parsed.data.month, year: parsed.data.year },
      },
      update: { amount: parsed.data.amount },
      create: {
        month: parsed.data.month,
        year: parsed.data.year,
        amount: parsed.data.amount,
      },
    });

    return NextResponse.json({ ...budget, amount: decimalToNumber(budget.amount) });
  } catch {
    return NextResponse.json({ error: "Failed to set budget" }, { status: 500 });
  }
}
